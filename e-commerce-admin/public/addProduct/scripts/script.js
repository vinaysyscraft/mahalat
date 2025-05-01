// document.addEventListener('DOMContentLoaded', () => {
//     loadCategories();
//     const form = document.getElementById('addProductForm');

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         try {
//             // Show loading state
//             const submitButton = form.querySelector('button[type="submit"]');
//             const originalText = submitButton.textContent;
//             submitButton.disabled = true;
//             submitButton.innerHTML = `
//                 <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//                     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Adding Product...
//             `;

//             const formData = new FormData();
            
//             // Add basic fields
//             formData.append('name', document.getElementById('name').value.trim());
//             formData.append('category', document.getElementById('category').value);
//             formData.append('description', document.getElementById('description').value.trim());
//             formData.append('price', document.getElementById('price').value);
//             formData.append('stock', document.getElementById('stock').value);

//             // Add sale price if provided
//             const salePrice = document.getElementById('salePrice').value;
//             if (salePrice) {
//                 formData.append('salePrice', salePrice);
//             }

//             // Add image
//             const imageFile = document.getElementById('image').files[0];
//             if (imageFile) {
//                 formData.append('image', imageFile);
//             }

//             // Add colors
//             const selectedColors = Array.from(document.querySelectorAll('input[name="colors"]:checked'))
//                 .map(cb => cb.value);
//             formData.append('colors', JSON.stringify(selectedColors));

//             // Add sizes
//             const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
//                 .map(cb => cb.value);
//             formData.append('sizes', JSON.stringify(selectedSizes));

//             // Get admin token
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 window.location.href = '../index.html';
//                 return;
//             }

//             // Send request
//             const response = await fetch('/api/products', {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             });

//             if (!response.ok) {
//                 const errorText = await response.text(); // Get the error response text
//                 throw new Error(`Failed to create product: ${errorText}`);
//             }

//             const data = await response.json();

//             if (data.status === 'success') {
//                 showAlert('Product added successfully!', 'success');
//                 // Redirect to products page after short delay
//                 setTimeout(() => {
//                     window.location.href = '../products/index.html';
//                 }, 1500);
//             } else {
//                 throw new Error(data.message || 'Failed to add product');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             showAlert(error.message || 'Error adding product', 'error');
//         } finally {
//             // Reset button state
//             const submitButton = form.querySelector('button[type="submit"]');
//             submitButton.disabled = false;
//             submitButton.textContent = 'Add Product';
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadBrands();
    const form = document.getElementById('addProductForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Product...
            `;

            const formData = new FormData();
            
            // Add basic fields
            formData.append('name', document.getElementById('name').value.trim());
            formData.append('category', document.getElementById('category').value);
            formData.append('subcategory', document.getElementById('subcategory').value);  // Add subcategory
            formData.append('subsubcategory', document.getElementById('subsubcategory').value);
            formData.append('description', document.getElementById('description').value.trim());
            formData.append('price', document.getElementById('price').value);
            formData.append('stock', document.getElementById('stock').value);
            formData.append('brand', document.getElementById('brands').value);
            formData.append('productSku', document.getElementById('productSku').value);
            formData.append('styleNo', document.getElementById('styleNo').value);


            // Add sale price if provided
            const salePrice = document.getElementById('salePrice').value;
            if (salePrice) {
                formData.append('salePrice', salePrice);
            }

            // Add image
            const imageFile = document.getElementById('image').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Add gallery images
            const galleryFiles = document.getElementById('imgGallery').files;
            for (let i = 0; i < galleryFiles.length; i++) {
                formData.append('imgGallery', galleryFiles[i]);
            }

            // Add colors
            const selectedColors = Array.from(document.querySelectorAll('input[name="colors"]:checked'))
                .map(cb => cb.value);
            formData.append('colors', JSON.stringify(selectedColors));

            // Add sizes
            const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked'))
                .map(cb => cb.value);
            formData.append('sizes', JSON.stringify(selectedSizes));

            // Get admin token
            const token = localStorage.getItem('adminToken');
            if (!token) {
                window.location.href = '../index.html';
                return;
            }

            // Send request
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error response text
                throw new Error(`Failed to create product: ${errorText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                showAlert('Product added successfully!', 'success');
                // Redirect to products page after short delay
                setTimeout(() => {
                    window.location.href = '../products/index.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message || 'Error adding product', 'error');
        } finally {
            // Reset button state
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Add Product';
        }
    });
});

async function loadBrands() {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '../index.html';
            return;
        }

        const response = await fetch('/api/brands', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        const brandSelect = document.getElementById('brands');
        brandSelect.disabled = false;
        brandSelect.innerHTML = '<option value="">Select a brand</option>';

        if (data.success && Array.isArray(data.brands)) {
            data.brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand._id;
                option.textContent = brand.name;
                brandSelect.appendChild(option);
            });
        } else {
            showAlert('Failed to load brands', 'error');
        }
    } catch (error) {
        console.error('Error loading brands:', error);
        showAlert('Error loading brands', 'error');
    }
}


let allCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
});

async function loadCategories() {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '../index.html';
            return;
        }

        const res = await fetch('/api/categories', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        if (!data.success) return alert('Failed to load categories');

        allCategories = data.categories;

        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select a category</option>';

        const parentCats = allCategories.filter(cat => !cat.parentId);
        parentCats.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat._id;
            opt.textContent = cat.name;
            categorySelect.appendChild(opt);
        });

    } catch (err) {
        console.error(err);
        alert('Error loading categories');
    }
}

document.getElementById('category').addEventListener('change', function () {
    const selectedId = this.value;
    const subSelect = document.getElementById('subcategory');
    const subSubSelect = document.getElementById('subsubcategory');

    subSelect.innerHTML = '<option value="">Select a subcategory</option>';
    subSubSelect.innerHTML = '<option value="">Select a sub-subcategory</option>';
    subSelect.disabled = true;
    subSubSelect.disabled = true;

    if (!selectedId) return;

    const parent = allCategories.find(c => c._id === selectedId);
    if (parent?.subcategories?.length) {
        parent.subcategories.forEach(sc => {
            const opt = document.createElement('option');
            opt.value = sc._id;
            opt.textContent = sc.name;
            subSelect.appendChild(opt);
        });
        subSelect.disabled = false;
    }
});

document.getElementById('subcategory').addEventListener('change', function () {
    const catId = document.getElementById('category').value;
    const subId = this.value;
    const subSubSelect = document.getElementById('subsubcategory');

    subSubSelect.innerHTML = '<option value="">Select a sub-subcategory</option>';
    subSubSelect.disabled = true;

    const parent = allCategories.find(c => c._id === catId);
    const sub = parent?.subcategories?.find(sc => sc._id === subId);

    // ✅ Check if sub-subcategories exist and populate them
    if (sub?.subcategories?.length) {
        sub.subcategories.forEach(ssc => {
            const opt = document.createElement('option');
            opt.value = ssc._id;
            opt.textContent = ssc.name;
            subSubSelect.appendChild(opt);
        });
        subSubSelect.disabled = false;
    }
});




// Update your existing createProduct function to include category
async function createProduct(formData) {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = '../index.html';
            return;
        }

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (data.status === 'success') {
            showAlert('Product created successfully', 'success');
            document.getElementById('productForm').reset();
        } else {
            showAlert(data.message || 'Failed to create product', 'error');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        showAlert('Error creating product', 'error');
    }
}

// Alert function (same as in products page)
function showAlert(message, type) {
    const alert = document.createElement('div');
    
    alert.className = `fixed top-4 right-4 z-50 p-4 pr-12 rounded-lg shadow-lg transform transition-all 
        ${type === 'success' 
            ? 'bg-green-50 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200'
        }`;

    // Create icon based on type
    const icon = document.createElement('span');
    icon.className = 'absolute left-4 top-4';
    icon.innerHTML = type === 'success' 
        ? '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'
        : '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';

    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'ml-8';
    
    // Add title based on type
    const title = document.createElement('h3');
    title.className = 'text-sm font-medium';
    title.textContent = type === 'success' ? 'Success!' : 'Error!';
    
    // Add message
    const text = document.createElement('p');
    text.className = 'mt-1 text-sm';
    text.textContent = message;
    
    messageContainer.appendChild(title);
    messageContainer.appendChild(text);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = `absolute top-4 right-4 text-${type === 'success' ? 'green' : 'red'}-500 dark:text-${type === 'success' ? 'green' : 'red'}-200 hover:opacity-75`;
    closeButton.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>';
    
    closeButton.onclick = () => alert.remove();

    alert.appendChild(icon);
    alert.appendChild(messageContainer);
    alert.appendChild(closeButton);
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.transform = 'translateX(100%)';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
} 

function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('theme');
    window.location.href = '/';
  }