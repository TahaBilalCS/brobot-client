import keyboard
import time
import sys

keyboard.add_hotkey('enter', lambda: keyboard.block_key("enter"))
time.sleep(300) # seconds
quit()
