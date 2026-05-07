import platform
import subprocess
import json
import psutil

# source /Users/thomxsnguyen/Desktop/SignalLess/.venv/bin/activate

if platform.system() == 'Windows':
  import wmi # only runs on windows
elif platform.system() == "Darwin":
  temperature = "Not supported on Mac via psutil"


def get_system_info():
  return {
    "os": platform.system(),
    "version": platform.version(),
    "architecture": platform.machine()
  }

def get_cpu_info():
  per_core_usage = psutil.cpu_percent(percpu=True)
  cpu_speed = psutil.cpu_freq()
  core_count = psutil.cpu_count()
  boot_time = psutil.boot_time()

  return {
    {
      "cpu_model": 
      "cores": core_count,
      "cpu_freq": cpu_speed,
      "per_core_usage": per_core_usage
    }
  }

def collect_all():
  data = {
    "system": get_system_info(),
    "cpu": get_cpu_info()
    ""
  }
if __name__ == '__main__':
  get_cpu_info()
