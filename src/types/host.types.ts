export interface CpuData {
    cpu: string;
    total: number;
    idle: number;
    used: number;
    usage: number;
}

export interface DiskData {
    Filesystem: string;
    Size: string;
    Used: string;
    Avail: string;
    Use: string;
    Mounted: string;
}

export interface MemData {
    total: string;
    used: string;
    available: string;
}

export interface SystemInfo {
    Hostname: string;
    KernelName: string;
    KernelRelease: string;
    OperatingSystemPrettyName: string;
    HardwareVendor: string;
    HardwareModel: string;
}