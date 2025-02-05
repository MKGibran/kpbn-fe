
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
    {
        title: 'Logout',
        icon: 'logout-3-line-duotone',
        to: '/logout'
    },
    { header: 'auth' },
    {
        title: 'Login',
        icon: 'login-3-line-duotone',
        to: '/auth/login'
    },
    {
        title: 'Register',
        icon: 'user-plus-rounded-line-duotone',
        to: '/auth/register'
    },
    { header: 'Extra' },
    {
        title: 'Icons',
        icon: 'sticker-smile-circle-2-line-duotone',
        to: '/settings'
    },
    {
        title: 'Sample Page',
        icon: 'planet-3-line-duotone',
        to: '/sample-page'
    },

];

export default sidebarItem;
