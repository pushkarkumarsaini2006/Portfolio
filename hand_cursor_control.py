import math
import time

import cv2
import mediapipe as mp
import pyautogui


# Keep fail-safe enabled: move mouse to top-left to abort quickly.
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0


class HandMouseController:
    def __init__(self):
        self.screen_w, self.screen_h = pyautogui.size()

        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 960)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 540)
        self.cap.set(cv2.CAP_PROP_FPS, 30)

        self.mp_hands = mp.solutions.hands
        self.mp_draw = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7,
        )

        self.prev_x = self.screen_w // 2
        self.prev_y = self.screen_h // 2
        self.smoothing = 0.35  # Optimized for smooth + fast movement

        self.click_cooldown = 0.2  # Even faster clicks
        self.last_click_time = 0

    @staticmethod
    def _distance(p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    @staticmethod
    def _fingers_up(landmarks):
        # Thumb is not used for movement state in this controller.
        index_up = landmarks[8].y < landmarks[6].y
        middle_up = landmarks[12].y < landmarks[10].y
        ring_up = landmarks[16].y < landmarks[14].y
        pinky_up = landmarks[20].y < landmarks[18].y
        return index_up, middle_up, ring_up, pinky_up

    def run(self):
        if not self.cap.isOpened():
            raise RuntimeError("Could not open webcam.")

        print("Hand cursor control started")
        print("="*50)
        print("GESTURES:")
        print("  ☝️  ONE FINGER (Index up)      → Move cursor")
        print("  ☝️☝️  TWO FINGERS (Index+Middle) → CLICK ✓")
        print("  🤌 PINCH (Index+Thumb)       → Click (legacy)")
        print("="*50)
        print("Press 'q' in camera window to quit")

        while True:
            ok, frame = self.cap.read()
            if not ok:
                continue

            frame = cv2.flip(frame, 1)
            h, w, _ = frame.shape
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = self.hands.process(rgb)

            if result.multi_hand_landmarks:
                hand = result.multi_hand_landmarks[0]
                self.mp_draw.draw_landmarks(
                    frame,
                    hand,
                    self.mp_hands.HAND_CONNECTIONS,
                )

                lm = hand.landmark
                index_up, middle_up, ring_up, pinky_up = self._fingers_up(lm)

                index_tip = (int(lm[8].x * w), int(lm[8].y * h))
                thumb_tip = (int(lm[4].x * w), int(lm[4].y * h))

                # Two-finger click gesture (PRIORITY): index + middle both up.
                if index_up and middle_up and not ring_up and not pinky_up:
                    now = time.time()
                    if now - self.last_click_time > self.click_cooldown:
                        x, y = pyautogui.position()
                        print(f"✓ TWO-FINGER CLICK at cursor ({x}, {y})")
                        pyautogui.click()
                        self.last_click_time = now

                    cv2.circle(frame, index_tip, 10, (0, 255, 0), cv2.FILLED)
                    middle_tip = (int(lm[12].x * w), int(lm[12].y * h))
                    cv2.circle(frame, middle_tip, 10, (0, 255, 0), cv2.FILLED)
                    cv2.putText(
                        frame,
                        "TWO-FINGER CLICK",
                        (20, 80),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,
                        (0, 255, 0),
                        2,
                    )
                    cv2.putText(
                        frame,
                        f"Cooldown: {max(0, self.click_cooldown - (now - self.last_click_time)):.2f}s",
                        (20, 120),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (0, 255, 0),
                        1,
                    )
                # Cursor movement mode: index is up (alone) and middle/ring/pinky are down.
                elif index_up and not middle_up and not ring_up and not pinky_up:
                    target_x = int((index_tip[0] / w) * self.screen_w)
                    target_y = int((index_tip[1] / h) * self.screen_h)

                    # Optimized smoothing with adaptive interpolation for fast response
                    smooth_x = int(self.prev_x + (target_x - self.prev_x) * self.smoothing)
                    smooth_y = int(self.prev_y + (target_y - self.prev_y) * self.smoothing)

                    # Move cursor with minimal delay
                    pyautogui.moveTo(smooth_x, smooth_y, duration=0)
                    self.prev_x, self.prev_y = smooth_x, smooth_y

                    cv2.putText(
                        frame,
                        "MOVE",
                        (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,
                        (50, 220, 50),
                        2,
                    )

                # Pinch click gesture: index + thumb close together.
                pinch_distance = self._distance(index_tip, thumb_tip)
                if pinch_distance < 28:
                    now = time.time()
                    if now - self.last_click_time > self.click_cooldown:
                        pyautogui.click()
                        self.last_click_time = now

                    cv2.circle(frame, index_tip, 10, (0, 0, 255), cv2.FILLED)
                    cv2.circle(frame, thumb_tip, 10, (0, 0, 255), cv2.FILLED)
                    cv2.putText(
                        frame,
                        "CLICK",
                        (20, 80),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,
                        (0, 0, 255),
                        2,
                    )

            cv2.imshow("Hand Cursor Control", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

        self.cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    controller = HandMouseController()
    controller.run()
