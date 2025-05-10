$(document).ready(function () {
    handleMultiLanguage()
})

function handleMultiLanguage() {
    const LANG_KEY = 'luxury_language';
    const translations = {
        'en': {
            users: "User Management",
            user_title: "User list statistics",
            course: "Course Management",
            list_user: "User List",
            user_id: "User id",
            user_name: "User name",
            user_createat: "Creation date",
            course_title: "Course list statistics",
            list_course: "Course list",
            course_id: "Course id",
            course_name: "Name",
            course_instructor: "Instructor",
            course_description: "Description",
            course_price: "Price",
            course_createat: "Creation date",
            products: "Products",
            customers: "Customers",
            analytics: "Analytics",
            management: "Management",
            promotions: "Promotions",
            revenue: "Revenue",
            settings: "Settings",
            darkMode: "Dark Mode",
            login: "Login",
            register: "Register",
            logout: "Logout",
            profile: "Profile",
            search: "Search...",
            addProduct: "Add Product",
            productList: "Product List",
            image: "Image",
            productName: "Product Name",
            description: "Description",
            price: "Price",
            dateCreated: "Date Created",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            saveChanges: "Save Changes",
            close: "Close",
            cart: "Cart",
            unitPrice: "Unit Price",
            quantity: "Quantity",
            subtotal: "Subtotal",
            total: "Total",
            checkout: "Checkout",
            emptyCart: "Your cart is empty"
        },
        'vi': {
            users: "Quản Lý Người Dùng",
            user_title: "Thống kê danh sách người dùng",
            course: "Quản lý khóa học",
            list_user: "Danh sách người dùng",
            user_id: "Mã người dùng",
            user_name: "Tên người dùng",
            user_createat: "Ngày tạo",
            course_title: "Thống kê danh sách khóa học",
            list_course: "Danh sách khóa học",
            course_id: "Mã khóa học",
            course_name: "Tên khóa học",
            course_instructor: "Người hướng dẫn",
            course_description: "Mô tả",
            course_createat: "Ngày tạo",
            course_price: "Giá",
            products: "Sản phẩm",
            customers: "Khách hàng",
            analytics: "Phân tích",
            management: "Quản lý",
            promotions: "Khuyến mãi",
            revenue: "Doanh thu",
            settings: "Cài đặt",
            darkMode: "Chế độ tối",
            login: "Đăng nhập",
            register: "Đăng ký",
            logout: "Đăng xuất",
            profile: "Hồ sơ",
            search: "Tìm kiếm...",
            addProduct: "Thêm sản phẩm",
            productList: "Danh sách sản phẩm",
            image: "Hình ảnh",
            productName: "Tên sản phẩm",
            description: "Mô tả",
            price: "Giá",
            dateCreated: "Ngày tạo",
            actions: "Thao tác",
            edit: "Sửa",
            delete: "Xóa",
            saveChanges: "Lưu thay đổi",
            close: "Đóng",
            cart: "Giỏ hàng",
            unitPrice: "Đơn giá",
            quantity: "Số lượng",
            subtotal: "Thành tiền",
            total: "Tổng cộng",
            checkout: "Thanh toán",
            emptyCart: "Giỏ hàng trống"
        }
    };

    // Set language
    function setLanguage(lang) {
        localStorage.setItem(LANG_KEY, lang);
        applyTranslations(lang);
        
        $('.language-item').removeClass('active');
        $(`.language-item[data-lang="${lang}"]`).addClass('active');
    }

    // Apply translations
    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;

        // Translate all elements with data-https://flagcdn.com/w20/us.pngi18n attribute
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            $(this).text(t[key] || key);
        });

        // Translate placeholders
        $('[data-i18n-placeholder]').each(function() {
            const key = $(this).data('i18n-placeholder');
            $(this).attr('placeholder', t[key] || key);
        });
    }

    // Initialize language
    function initLanguage() {
        const savedLang = localStorage.getItem(LANG_KEY) || 'vi';
        setLanguage(savedLang);
    }

    // Language switcher event
    $('.language-item').on('click', function() {
        const lang = $(this).data('lang');
        switch (lang) {
            case 'en':
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/us.png');
                setLanguage('en');
                break;
            case 'vi':
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/vn.png');
                setLanguage('vi');
                break;
            default:
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/vn.png');
                setLanguage('vi');
        }
    });

    // Initialize
    if ($('[data-i18n]').length) {
        initLanguage();
    }
}