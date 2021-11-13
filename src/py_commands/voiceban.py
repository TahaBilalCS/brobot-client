import time
import sys
from ahk import AHK
ahk = AHK(executable_path="C:\Program Files\AutoHotkey\AutoHotkey.exe")
time_to_sleep=int(sys.argv[1]) # seconds

ahk.key_press('F8')
time.sleep(time_to_sleep)
ahk.key_press('F9')
quit()
