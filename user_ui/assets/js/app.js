$(document).ready(function() {
    // Kiểm tra trạng thái đăng nhập
    checkAuthStatus();
    
    // Dark mode toggle
    $('#darkModeToggle').click(function() {
        $('body').toggleClass('dark-mode');
        localStorage.setItem('darkMode', $('body').hasClass('dark-mode'));
    });
    
    // Áp dụng dark mode nếu đã lưu
    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }
    
    // Load sản phẩm nổi bật (trang chủ)
    if ($('#featuredProducts').length) {
        loadFeaturedProducts();
    }

    $('#search_bar').on('keypress', function (e) {
        if(e.which === 13){
        }
  });
});

function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        $('#authButtons').addClass('d-none');
        $('#userMenu').removeClass('d-none');
        $('#userName').text(currentUser.name);
    } else {
        $('#authButtons').removeClass('d-none');
        $('#userMenu').addClass('d-none');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    checkAuthStatus();
    window.location.href = 'index.html';
}

// Gắn sự kiện logout
$(document).on('click', '#logoutBtn', function(e) {
    e.preventDefault();
    logout();
});

async function loadFeaturedSearchProducts(name) {
    try {
        const products = await searchProducts(name);
        const featuredContainer = $('#featuredProducts');
        featuredContainer.empty();
        
        // Lấy 4 sản phẩm đầu tiên làm nổi bật
        products.slice(0, 4).forEach(product => {
            featuredContainer.append(createProductCard(product));
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
        $('#featuredProducts').html(`
            <div class="col-12 text-center text-danger">
                Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
            </div>
        `);
    }
}


async function loadFeaturedProducts() {
    try {
        const products = await fetchProducts();
        const featuredContainer = $('#featuredProducts');
        featuredContainer.empty();
        
        // Lấy 4 sản phẩm đầu tiên làm nổi bật
        products.slice(0, 4).forEach(product => {
            featuredContainer.append(createProductCard(product));
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
        $('#featuredProducts').html(`
            <div class="col-12 text-center text-danger">
                Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
            </div>
        `);
    }
}

function createProductCard(product) {
    return `
        <div class="col-md-3 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image || 'assets/images/placeholder.jpg'}" 
                     class="card-img-top product-image" 
                     alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-truncate">${product.description}</p>
                    <p class="price fw-bold">${formatPrice(product.price)}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-primary">Xem chi tiết</a>
                    <button class="btn btn-sm btn-success add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `;
}