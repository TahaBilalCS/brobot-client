import keyboard
import time
import sys

time_to_sleep=int(sys.argv[1]) # seconds
keyboard.block_key("enter")
time.sleep(time_to_sleep)
quit()
