let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('searchProduct');
  const categoryFilter = document.getElementById('categoryFilter');
  const productList = document.getElementById('product-list');

  // First load categories
  await loadCategories();

  // Then fetch products
  await fetchProducts();

  // Add event listeners after data is loaded
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
});


// Function to load categories
async function loadCategories() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '../index.html';
      return;
    }

    // Fetch categories from the new API endpoint
    const response = await fetch('/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();

    if (data.success) {
      const categoryFilter = document.getElementById('categoryFilter');
      
      // Keep the first "All Categories" option
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
      
      // Add categories and subcategories from server
      data.categories.forEach(parentCategory => {
        // Create an option for the parent category
        const parentOption = document.createElement('option');
        parentOption.value = parentCategory._id;
        parentOption.textContent = parentCategory.name;
        categoryFilter.appendChild(parentOption);

        // Add subcategories if they exist
        parentCategory.subcategories.forEach(subCategory => {
          const subCategoryOption = document.createElement('option');
          subCategoryOption.value = subCategory._id;
          subCategoryOption.textContent = `-- ${subCategory.name}`;
          categoryFilter.appendChild(subCategoryOption);
        });
      });
    } else {
      throw new Error(data.message || 'Failed to load categories');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert(error.message || 'Error loading categories', 'error');
  }
}

// Fetch products function
async function fetchProducts() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '../index.html';
      return;
    }

    const response = await fetch('/api/products', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error response text
      throw new Error(`Failed to fetch products: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.data) {
      allProducts = data.data;
      filterProducts();
    } else {
      throw new Error(data.message || 'No products found');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert(error.message || 'Error fetching products', 'error');
  }
}

// Filter products function
function filterProducts() {
  const searchTerm = document.getElementById('searchProduct').value.toLowerCase();
  const categoryValue = document.getElementById('categoryFilter').value;
  const statusValue = document.getElementById('statusFilter')?.value || 'all';

  const filteredProducts = allProducts.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm);
    const categoryMatch = 
      categoryValue === 'all' || 
      (product.category._id === categoryValue);

    const statusMatch = 
      statusValue === 'all' || 
      (statusValue === 'instock' && product.stock > 0) ||
      (statusValue === 'outofstock' && product.stock === 0);

    return nameMatch && categoryMatch && statusMatch;
  });
  document.getElementById('total-products-count').textContent = filteredProducts.length;
  displayProducts(filteredProducts);
}


// Display products function
function displayProducts(products) {
  const productList = document.getElementById('product-list');

  productList.innerHTML = products.map(product => `
    <tr class="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
      <td class="py-4 px-4">
        <img src="/uploads/products/${product.image}" alt="${product.name}" class="product-image">
      </td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.name}</td>
      <td class="py-4 px-4 description text-gray-900 dark:text-gray-300">${product.description}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.category ? product.category.name : 'No Category'}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.subcategory ? product.subcategory.name : 'No Subcategory'}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">$${product.price}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.salePrice ? `$${product.salePrice}` : 'N/A'}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.colors.join(', ')}</td>
      <td class="py-4 px-4 text-gray-900 dark:text-gray-300">${product.sizes.join(', ')}</td>
      <td class="py-4 px-4 text-center">
        <button onclick="editProduct('${product._id}')"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline mr-2">
          Edit
        </button>
        <button onclick="deleteProduct('${product._id}')"
                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}


// Edit product function
async function editProduct(id) {
  const modal = document.getElementById('edit-product-modal');
  const form = document.getElementById('edit-product-form');

  try {
    const token = localStorage.getItem('adminToken');

    // Fetch categories first
    const categoryResponse = await fetch('/api/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!categoryResponse.ok) {
      throw new Error('Failed to fetch categories');
    }

    const categoryData = await categoryResponse.json();
    const categorySelect = document.getElementById('edit-category');
    const subcategorySelect = document.getElementById('edit-subcategory');

    let allCategories = []; // ✅ Declare it here

    if (categoryData.success) {
      categorySelect.innerHTML = '';
      allCategories = categoryData.categories;

      // Populate categories
      allCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category._id; // ✅ Use _id here
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

      // Handle category change
      categorySelect.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const selectedCategory = allCategories.find(cat => cat._id === selectedId);
        if (selectedCategory && selectedCategory.subcategories) {
          loadSubcategories(selectedCategory.subcategories);
        } else {
          subcategorySelect.innerHTML = '';
        }
      });
    }

    // ✅ Define this function AFTER allCategories is declared
    function loadSubcategories(subcategories) {
      subcategorySelect.innerHTML = '';
      subcategories.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub._id;
        option.textContent = sub.name;
        subcategorySelect.appendChild(option);
      });
    }

    // Fetch product details
    const productResponse = await fetch(`/api/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!productResponse.ok) {
      throw new Error('Failed to fetch product details');
    }

    const data = await productResponse.json();
    const product = data.data || data;

    if (!product) {
      throw new Error('Product not found');
    }

    // Set form values
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-category').value = product.category._id;
    
    const selectedCategory = allCategories.find(cat => cat._id === product.category._id);
    if (selectedCategory) {
      loadSubcategories(selectedCategory.subcategories);
    }

    document.getElementById('edit-subcategory').value = product.subcategory._id;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-salePrice').value = product.salePrice || '';
    document.getElementById('edit-stock').value = product.stock;

    document.querySelectorAll('input[name="colors"]').forEach(cb => {
      cb.checked = product.colors?.includes(cb.value);
    });

    document.querySelectorAll('input[name="sizes"]').forEach(cb => {
      cb.checked = product.sizes?.includes(cb.value);
    });

    openEditModal();

    form.onsubmit = async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData();

        const selectedColors = Array.from(document.querySelectorAll('input[name="colors"]:checked')).map(cb => cb.value);
        const selectedSizes = Array.from(document.querySelectorAll('input[name="sizes"]:checked')).map(cb => cb.value);

        formData.append('name', document.getElementById('edit-name').value);
        formData.append('category', document.getElementById('edit-category').value);
        formData.append('subcategory', document.getElementById('edit-subcategory').value);
        formData.append('description', document.getElementById('edit-description').value);
        formData.append('price', document.getElementById('edit-price').value);
        formData.append('salePrice', document.getElementById('edit-salePrice').value || '');
        formData.append('stock', document.getElementById('edit-stock').value);
        formData.append('colors', JSON.stringify(selectedColors));
        formData.append('sizes', JSON.stringify(selectedSizes));

        const imageFile = document.getElementById('edit-image').files[0];
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Updating...';

        const response = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          showAlert('Product updated successfully!', 'success');
          closeEditModal();
          await fetchProducts();
        } else {
          throw new Error(result.message || 'Failed to update product');
        }
      } catch (error) {
        console.error('Error:', error);
        showAlert(error.message || 'Error updating product', 'error');
      } finally {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Save Changes';
      }
    };
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error loading product details', 'error');
  }
}


// Close modal function
function closeEditModal() {
  const modal = document.getElementById('edit-product-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Re-enable body scroll
}

// Open modal function
function openEditModal() {
  const modal = document.getElementById('edit-product-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Disable body scroll
}

// Add event listeners
document.getElementById('close-product-modal').addEventListener('click', closeEditModal);

// Close modal when clicking outside
document.getElementById('edit-product-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    closeEditModal();
  }
});

// Delete product function
function deleteProduct(id) {
  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-4 transform transition-all';
  modal.innerHTML = `
    <div class="text-center">
      <!-- Warning Icon -->
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
        <svg class="h-6 w-6 text-red-600 dark:text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Delete Product
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Are you sure you want to delete this product? This action cannot be undone.
      </p>
      
      <div class="flex justify-center space-x-4">
        <button id="cancel-delete" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors">
          Cancel
        </button>
        <button id="confirm-delete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors">
          Delete
        </button>
      </div>
    </div>
  `;

  // Add modal to page
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Handle cancel
  const cancelButton = modal.querySelector('#cancel-delete');
  cancelButton.onclick = () => {
    backdrop.remove();
  };

  // Handle click outside modal
  backdrop.onclick = (e) => {
    if (e.target === backdrop) {
      backdrop.remove();
    }
  };

  // Handle delete confirmation
  const deleteButton = modal.querySelector('#confirm-delete');
  deleteButton.onclick = async () => {
    try {
      deleteButton.disabled = true;
      deleteButton.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Deleting...
      `;

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && (data.success || data.status === 'success')) {
        backdrop.remove();
        showAlert('Product deleted successfully', 'success');
        await fetchProducts(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error:', error);
      showAlert(error.message || 'Error deleting product', 'error');
    }
  };
}

// Add this at the top of your file
function showAlert(message, type) {
  const alert = document.createElement('div');
  
  // Add Tailwind classes for better UI
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
  
  // Add click handler to close button
  closeButton.onclick = () => {
    alert.remove();
  };

  // Add elements to alert
  alert.appendChild(icon);
  alert.appendChild(messageContainer);
  alert.appendChild(closeButton);

  // Add alert to document
  document.body.appendChild(alert);

  // Add entrance animation
  requestAnimationFrame(() => {
    alert.style.transform = 'translateX(0)';
    alert.style.opacity = '1';
  });

  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.style.transform = 'translateX(100%)';
    alert.style.opacity = '0';
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 5000);
} 

function handleLogout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('theme');
  window.location.href = '/';
}