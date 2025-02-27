export interface VmFormData {
    name: string;
    memory: number;
    vcpus: number;
    disk_size: number;
    iso_image: string;
    network_bridge: string;
    os_variant: string;
}

export interface NetworkOption {
    name: string;
    type: 'bridge' | 'nat';
    value: string;
    active?: boolean;
}

export interface VmList {
    [key: string]: {
        'state.state': string;
        'state.reason': string;
        'balloon.current': string;
        'vcpu.current': number;
    }
}

export interface IsoStatus {
    status: 'downloading' | 'success' | 'error';
    message?: string;
    timestamp?: number;
}

export interface IsoFile {
    name: string;
    path: string;
}


export interface VmSpiceConfig {
    port: string;
    type: string;
    listen: string;
}

export interface VmOsInfo {
    type: string;
    arch: string;
}

export interface VmNetworkInterface {
    name: string;
    hardware_address: string;
    ip_addresses: Array<{
        type: string;
        address: string;
    }>;
}

export interface VmStats {
    cpu: {
        total_time: number;
        user_time: number;
        system_time: number;
    };
    memory: {
        current: number;
        available: number;
        unused: number;
        rss: number;
    };
    disk: {
        [key: string]: {
            reads: number;
            writes: number;
            capacity: number;
            allocation: number;
        };
    };
    network: {
        [key: string]: {
            rx_bytes: number;
            tx_bytes: number;
            rx_packets: number;
            tx_packets: number;
        };
    };
}

export interface VmDetails {
    name: string;
    memory: string;
    vcpu: string;
    os: VmOsInfo;
    spice: VmSpiceConfig;
    network: VmNetworkInterface[];
    stats: VmStats;
}