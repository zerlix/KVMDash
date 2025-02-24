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