const apiBaseUrl = '/api/categories';
let categories = [];
let editingCategoryId = null;

// Fetch categories from server
async function fetchCategories() {
  try {
    const res = await fetch(apiBaseUrl);
    const data = await res.json();
    if (data.success) {
      categories = data.categories;
      renderCategories();
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
}

// Render categories with cards and modern layout
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';

  categories.forEach(category => {
    const card = document.createElement('div');
    card.className = 'bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105';
    card.innerHTML = `
      <div class="relative">
        <img src="/public/uploads/categories/${category.image || 'placeholder.jpg'}" alt="${category.name}" class="w-full h-56 object-cover rounded-lg mb-4 shadow-md">
      </div>
      <h2 class="text-lg font-bold text-gray-800 mb-3">${category.name}</h2>
      ${renderSubCategories(category.subcategories || [], category._id)}
      <div class="flex justify-between items-center mt-4">
        <div class="space-x-2">
          <button onclick="openEditModal('${category._id}', '${category.name}')" class="text-blue-500 text-lg">
            <i class="ri-edit-line"></i>
          </button>
          <button onclick="deleteCategory('${category._id}')" class="text-red-500 text-lg">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Render subcategories with modern style
function renderSubCategories(subs, parentId) {
  return subs.map(sub => `
    <div class="ml-8 mt-4 border-l-4 border-gray-300 pl-4">
      <div class="flex justify-between items-center">
        <div>
          <strong class="text-gray-700">${sub.name}</strong>
          <br />
          ${sub.image ? `<img src="/public/uploads/categories/${sub.image}" alt="${sub.name}" class="w-20 h-20 object-cover rounded mt-2"/>` : ''}
        </div>
        <div class="space-x-2">
          <button onclick="openAddModal('${sub._id}')" class="text-green-500 text-sm">+ Subcategory</button>
          <button onclick="openEditModal('${sub._id}', '${sub.name}')" class="text-blue-500"><i class="ri-edit-line"></i></button>
          <button onclick="deleteCategory('${sub._id}')" class="text-red-500"><i class="ri-delete-bin-line"></i></button>
        </div>
      </div>
      ${sub.subcategories ? renderSubCategories(sub.subcategories, sub._id) : ''}
    </div>
  `).join('');
}

// Modal handlers
function openAddModal(parentId = '') {
  document.getElementById('categoryModal').classList.remove('hidden');
  document.getElementById('modalTitle').innerText = parentId ? 'Add Subcategory' : 'Add Category';
  document.getElementById('categoryName').value = '';
  document.getElementById('categoryImage').value = '';
  document.getElementById('categoryForm').dataset.parentId = parentId;
  editingCategoryId = null;
}

function openEditModal(id, name) {
  editingCategoryId = id;
  document.getElementById('modalTitle').innerText = 'Edit Category';
  document.getElementById('categoryName').value = name;
  document.getElementById('categoryImage').value = '';
  document.getElementById('categoryModal').classList.remove('hidden');
  document.getElementById('categoryForm').dataset.parentId = '';
}

function closeModal() {
  document.getElementById('categoryModal').classList.add('hidden');
}

// Save Category/Subcategory (Add or Edit)
document.getElementById('categoryForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('categoryName').value.trim();
  const imageFile = document.getElementById('categoryImage').files[0];
  const parentId = e.target.dataset.parentId || null;

  if (!name) return alert('Enter a category name');

  const formData = new FormData();
  formData.append('name', name);
  if (imageFile) formData.append('image', imageFile);
  if (parentId) formData.append('parentId', parentId);

  let url = apiBaseUrl;
  let method = 'POST';

  if (editingCategoryId) {
    url = `${apiBaseUrl}/${editingCategoryId}`;
    method = 'PUT';
  }

  try {
    const res = await fetch(url, {
      method,
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      closeModal();
      fetchCategories();
    } else {
      alert('Error saving category');
    }
  } catch (err) {
    console.error('Save error:', err);
    alert('Server error!');
  }
});

// Delete category
async function deleteCategory(id) {
  if (!confirm('Are you sure?')) return;
  try {
    const res = await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) fetchCategories();
    else alert('Delete failed');
  } catch (err) {
    console.error('Delete error:', err);
    alert('Server error');
  }
}

// Load categories on page load
fetchCategories();