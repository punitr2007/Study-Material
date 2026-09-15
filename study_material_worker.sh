#!/system/bin/sh
# ==============================================================================
# Magisk Late-Start Boot Service: NSUT Study Material AutoSync Daemon
# Location on phone: /data/adb/service.d/study_material_worker.sh
# ==============================================================================

# Wait for system boot to complete
while [ "$(getprop sys.boot_completed)" != "1" ]; do
  sleep 3
done
sleep 10

# 1. Whitelist Termux from Android Doze & Battery Optimization
cmd deviceidle whitelist +com.termux 2>/dev/null || true

# 2. Acquire kernel wake lock for reliable background scheduling
echo "study_material_worker" > /sys/power/wake_lock 2>/dev/null || true

# 3. Start SSH daemon and Crond inside Termux environment
su 10221 -g 3003 -c 'export PATH=/data/data/com.termux/files/usr/bin:$PATH; export PREFIX=/data/data/com.termux/files/usr; export HOME=/data/data/com.termux/files/home; /data/data/com.termux/files/usr/bin/sshd; /data/data/com.termux/files/usr/bin/crond'

# 4. Protect processes from Android Low Memory Killer (OOM Score -1000 = Unkillable)
for pid in $(pidof sshd crond); do
  if [ -f "/proc/$pid/oom_score_adj" ]; then
    echo -1000 > "/proc/$pid/oom_score_adj" 2>/dev/null || true
  fi
done
