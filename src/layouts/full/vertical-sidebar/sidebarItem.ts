
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
        icon: 'widget-add-line-duotone',
        to: '/'
    },
    {
        title: 'Detailed Report',
        icon: 'document-add-outline',
        to: '/detailed-report'
    },
    {
        title: 'Upload Data',
        icon: 'cloud-upload-broken',
        to: '/upload-data'
    },
    {
        title: 'Settings',
        icon: 'settings-linear',
        to: '/settings'
    },
    // {
    //     title: 'Logout',
    //     icon: 'logout-3-line-duotone',
    //     to: '/logout'
    // },
];

export default sidebarItem;
