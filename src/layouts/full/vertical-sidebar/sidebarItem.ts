
export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    {
        title: 'Dashboard',
        icon: 'solar:widget-add-line-duotone',
        to: '/'
    },
    {
        title: 'Detailed Report',
        icon: 'solar:document-add-outline',
        to: '/detailed-report'
    },
    {
        title: 'Upload Data',
        icon: 'solar:cloud-upload-broken',
        to: '/upload-data'
    },
    {
        title: 'Settings',
        icon: 'solar:settings-linear',
        to: '/settings'
    },
];

export default sidebarItem;
