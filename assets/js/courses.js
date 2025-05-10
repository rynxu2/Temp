$(document).ready(function () {
    handlecourses();
})

function handlecourses() {
    function loadcourses() {
        $.ajax({
            url: COURSES_ENDPOINT,
            method: 'GET',
            success: function(courses) {
                console.log(courses)
                renderCoursesTable(courses);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tải danh sách khóa học');
            }
        });
    }
    
    // Render courses table
    function renderCoursesTable(courses) {
        const tbody = $('#coursesTableBody');
        tbody.empty();
        
        if (courses.length === 0) {
            tbody.append('<tr><td colspan="7" class="text-center">Không có khóa học nào</td></tr>');
            return;
        }
        
        courses.forEach((course, index) => {
            console.log(course);
            const row = `
                <tr class="animate-fade-in">
                    <td>${course.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${course.image || 'https://via.placeholder.com/60'}"
                                class="avatar-sm" alt="${course.name}">
                            <span class="ms-2">${course.name}</span>
                        </div>
                    </td>
                    <td>${course.instructor}</td>
                    <td>$${course.price}</td>
                    <td>${course.description.substring(0, 50)}${course.description.length > 50 ? '...' : ''}</td>
                    <td>${new Date(course.createdAt).toLocaleDateString()}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary btn-edit" data-id="${course.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${course.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    // Add new course
    $('#btnAddCourse').on('click', function() {
        $('#courseModalTitle').text('Thêm khóa học mới');
        $('#courseForm')[0].reset();
        $('#courseId').val('');
        $('#imagePreview').addClass('d-none');
        $('#courseModal').modal('show');
    });
    
    // Edit course
    $(document).on('click', '.btn-edit', function() {
        const courseId = $(this).data('id');
        
        $.ajax({
            url: `${courseS_ENDPOINT}/${courseId}`,
            method: 'GET',
            success: function(course) {
                $('#courseModalTitle').text('Chỉnh sửa khóa học');
                $('#courseId').val(course.id);
                $('#courseTitle').val(course.title);
                $('#courseDescription').val(course.description);
                $('#coursePrice').val(course.price);
                
                if (course.image) {
                    $('#imagePreview').attr('src', course.image).removeClass('d-none');
                } else {
                    $('#imagePreview').addClass('d-none');
                }
                
                $('#courseModal').modal('show');
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tải thông tin khóa học');
            }
        });
    });
    
    // Save course
    $('#courseForm').on('submit', function(e) {
        e.preventDefault();
        
        const courseId = $('#courseId').val();
        const title = $('#courseTitle').val().trim();
        const description = $('#courseDescription').val().trim();
        const price = parseFloat($('#coursePrice').val());
        const imageFile = $('#courseImage')[0].files[0];
        
        // Validate inputs
        if (!title || !description || isNaN(price) || price <= 0) {
            showError('courseError', 'Vui lòng điền đầy đủ thông tin hợp lệ');
            return;
        }
        
        const courseData = {
            title: title,
            description: description,
            price: price,
            createdAt: new Date().toISOString()
        };
        
        // Handle image upload (mock - in a real app you would upload to a server)
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                courseData.image = e.target.result;
                savecourse(courseId, courseData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            savecourse(courseId, courseData);
        }
    });
    
    function savecourse(id, data) {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${courseS_ENDPOINT}/${id}` : courseS_ENDPOINT;
        
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function() {
                $('#courseModal').modal('hide');
                loadcourses();
            },
            error: function() {
                showError('courseError', 'Đã xảy ra lỗi khi lưu khóa học');
            }
        });
    }
    
    // Delete course
    $(document).on('click', '.btn-delete', function() {
        if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
            return;
        }
        
        const courseId = $(this).data('id');
        
        $.ajax({
            url: `${courseS_ENDPOINT}/${courseId}`,
            method: 'DELETE',
            success: function() {
                loadcourses();
            },
            error: function() {
                alert('Đã xảy ra lỗi khi xóa khóa học');
            }
        });
    });
    
    // Image preview
    $('#courseImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result).removeClass('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagePreview').addClass('d-none');
        }
    });
    
    // Search courses
    $('#courseSearch').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $.ajax({
            url: courseS_ENDPOINT,
            method: 'GET',
            success: function(courses) {
                const filteredcourses = courses.filter(course => 
                    course.title.toLowerCase().includes(searchTerm) || 
                    course.description.toLowerCase().includes(searchTerm)
                );
                rendercoursesTable(filteredcourses);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tìm kiếm khóa học');
            }
        });
    });
    
    // Filter courses
    $('#courseFilter').on('change', function() {
        const filter = $(this).val();
        
        $.ajax({
            url: courseS_ENDPOINT,
            method: 'GET',
            success: function(courses) {
                let sortedcourses = [...courses];
                
                if (filter === 'price_asc') {
                    sortedcourses.sort((a, b) => a.price - b.price);
                } else if (filter === 'price_desc') {
                    sortedcourses.sort((a, b) => b.price - a.price);
                }
                
                rendercoursesTable(sortedcourses);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi lọc khóa học');
            }
        });
    });
    
    // Initialize courses
    if ($('#coursesTable').length) {
        loadcourses();
    }
}