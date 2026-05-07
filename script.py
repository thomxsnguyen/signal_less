import psutil
import platform
import subprocess
import json
import datetime


def get_system_info():
    os_name = "macOS" if platform.system() == "Darwin" else platform.system()
    version = platform.mac_ver()[0] if platform.system() == "Darwin" else platform.version()
    return {
        "os": os_name,
        "version": version,
        "architecture": platform.machine(),
        "hostname": platform.node(),
        "python_version": platform.python_version()
    }


def get_cpu_info():
    # Get CPU model
    if platform.system() == "Darwin":
        result = subprocess.run(
            ["sysctl", "-n", "machdep.cpu.brand_string"],
            capture_output=True,
            text=True
        )
        cpu_model = result.stdout.strip() if result.returncode == 0 else "Apple Silicon"
        
        # For Apple Silicon, use a different command
        if not cpu_model:
            result = subprocess.run(
                ["sysctl", "-n", "hw.model"],
                capture_output=True,
                text=True
            )
            cpu_model = result.stdout.strip()
    else:
        cpu_model = platform.processor()

    # Get CPU frequency
    cpu_freq = psutil.cpu_freq()
    freq_info = {
        "current_mhz": round(cpu_freq.current, 2) if cpu_freq else None,
        "min_mhz": round(cpu_freq.min, 2) if cpu_freq else None,
        "max_mhz": round(cpu_freq.max, 2) if cpu_freq else None
    }

    # Get temperatures (platform specific)
    temperatures = {}
    if platform.system() == "Darwin":
        temperatures = {"note": "Temperature monitoring requires third-party tools on macOS"}
    else:
        try:
            temps = psutil.sensors_temperatures()
            if temps:
                for name, entries in temps.items():
                    temperatures[name] = [
                        {"label": e.label, "current": e.current, "high": e.high, "critical": e.critical}
                        for e in entries
                    ]
        except AttributeError:
            temperatures = {"note": "Temperature monitoring not supported"}

    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time()).strftime("%Y-%m-%d %H:%M:%S")

    return {
        "cpu_model": cpu_model,
        "physical_cores": psutil.cpu_count(logical=False),
        "logical_cores": psutil.cpu_count(logical=True),
        "cpu_freq": freq_info,
        "cpu_usage_percent": psutil.cpu_percent(interval=1),
        "per_core_usage": psutil.cpu_percent(percpu=True, interval=1),
        "temperatures": temperatures,
        "boot_time": boot_time
    }


def get_ram_info():
    ram = psutil.virtual_memory()
    swap = psutil.swap_memory()

    return {
        "total_gb": round(ram.total / (1024 ** 3), 2),
        "available_gb": round(ram.available / (1024 ** 3), 2),
        "used_gb": round(ram.used / (1024 ** 3), 2),
        "free_gb": round(ram.free / (1024 ** 3), 2),
        "usage_percent": ram.percent,
        "swap": {
            "total_gb": round(swap.total / (1024 ** 3), 2),
            "used_gb": round(swap.used / (1024 ** 3), 2),
            "free_gb": round(swap.free / (1024 ** 3), 2),
            "usage_percent": swap.percent
        }
    }


def get_disk_info():
    disks = []
    for partition in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            disks.append({
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "filesystem": partition.fstype,
                "total_gb": round(usage.total / (1024 ** 3), 2),
                "used_gb": round(usage.used / (1024 ** 3), 2),
                "free_gb": round(usage.free / (1024 ** 3), 2),
                "usage_percent": usage.percent
            })
        except PermissionError:
            continue

    # Disk I/O stats
    disk_io = psutil.disk_io_counters()
    io_stats = {
        "read_mb": round(disk_io.read_bytes / (1024 ** 2), 2) if disk_io else None,
        "write_mb": round(disk_io.write_bytes / (1024 ** 2), 2) if disk_io else None,
        "read_count": disk_io.read_count if disk_io else None,
        "write_count": disk_io.write_count if disk_io else None
    }

    return {
        "partitions": disks,
        "io_stats": io_stats
    }


def get_network_info():
    net_io = psutil.net_io_counters()
    net_if = psutil.net_if_addrs()
    net_stats = psutil.net_if_stats()

    interfaces = []
    for iface_name, iface_addrs in net_if.items():
        stats = net_stats.get(iface_name)
        addresses = []
        for addr in iface_addrs:
            addresses.append({
                "family": str(addr.family),
                "address": addr.address,
                "netmask": addr.netmask
            })
        interfaces.append({
            "name": iface_name,
            "is_up": stats.isup if stats else None,
            "speed_mbps": stats.speed if stats else None,
            "addresses": addresses
        })

    return {
        "bytes_sent_mb": round(net_io.bytes_sent / (1024 ** 2), 2),
        "bytes_received_mb": round(net_io.bytes_recv / (1024 ** 2), 2),
        "packets_sent": net_io.packets_sent,
        "packets_received": net_io.packets_recv,
        "errors_in": net_io.errin,
        "errors_out": net_io.errout,
        "dropped_in": net_io.dropin,
        "dropped_out": net_io.dropout,
        "interfaces": interfaces
    }


def get_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'status']):
        try:
            pinfo = proc.info
            if pinfo['cpu_percent'] is not None and pinfo['cpu_percent'] > 0:
                processes.append({
                    "pid": pinfo['pid'],
                    "name": pinfo['name'],
                    "cpu_percent": round(pinfo['cpu_percent'], 2),
                    "memory_percent": round(pinfo['memory_percent'], 2) if pinfo['memory_percent'] else 0,
                    "status": pinfo['status']
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    # Sort by CPU usage descending
    processes = sorted(processes, key=lambda x: x['cpu_percent'], reverse=True)[:20]
    return processes


def collect_all():
    print("Collecting system information...")

    data = {
        "collected_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "system": get_system_info(),
        "cpu": get_cpu_info(),
        "ram": get_ram_info(),
        "disk": get_disk_info(),
        "network": get_network_info(),
        "processes": get_processes()
    }

    with open("pc_info.json", "w") as f:
        json.dump(data, f, indent=4)

    print("✅ pc_info.json saved successfully!")
    print(f"📊 Collected info for: {data['system']['os']} {data['system']['version']}")
    return data


if __name__ == "__main__":
    collect_all()