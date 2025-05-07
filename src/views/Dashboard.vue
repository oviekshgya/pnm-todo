<template>
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-100 to-emerald-200 p-8">
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-emerald-700">Dashboard</h2>
                <button @click="logout" class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">
                    Logout
                </button>
            </div>

            <button @click="showCreateModal = true"
                class="bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition duration-200 mb-6">
                Create Product
            </button>

            <div v-if="showCreateModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 class="text-xl font-bold mb-4">Create Product</h3>
                    <form @submit.prevent="handleCreateProduct">
                        <div class="mb-4">
                            <input v-model="newProduct.name" type="text" placeholder="Product Name"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required />
                        </div>
                        <div class="mb-4">
                            <input v-model="newProduct.quantity" type="number" placeholder="Product Quantity"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required />
                        </div>
                        <div class="flex justify-between">
                            <button type="submit" class="bg-emerald-600 text-white py-2 px-4 rounded-lg">Create</button>
                            <button @click="showCreateModal = false"
                                class="bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="flex gap-4 mb-6">
                <input v-model="searchQuery" type="text" placeholder="Search by name"
                    class="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <select v-model="sortOrder" class="px-4 py-2 border rounded-lg">
                    <option value="nameAsc">Name A-Z</option>
                    <option value="nameDesc">Name Z-A</option>
                    <option value="createdAsc">Created At (Oldest)</option>
                    <option value="createdDesc">Created At (Newest)</option>
                </select>
            </div>

            <div v-if="filteredProducts.length === 0" class="text-center text-gray-600">No products found.</div>
            <table v-else class="min-w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-emerald-600 text-white">
                        <th class="px-4 py-2">Product Name</th>
                        <th class="px-4 py-2">Quantity</th>
                        <th class="px-4 py-2">Created At</th>
                        <th class="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product) in paginatedProducts" :key="product.id" class="border-b">
                        <td class="px-4 py-2">{{ product.name }}</td>
                        <td class="px-4 py-2">{{ product.quantity }}</td>
                        <td class="px-4 py-2">{{ formatDate(product.created_at) }}</td>
                        <td class="px-4 py-2 flex gap-2">
                            <button @click="editProduct(product)" class="text-blue-600 hover:underline">Edit</button>
                            <button @click="confirmDelete(product)" class="text-red-600 hover:underline">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="flex justify-center mt-4">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="bg-gray-300 text-black py-2 px-4 rounded-lg mr-2">
                    Previous
                </button>
                <span class="text-xl px-4 py-2">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="bg-gray-300 text-black py-2 px-4 rounded-lg ml-2">
                    Next
                </button>
            </div>
            <div v-if="showConfirmDelete" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 class="text-xl font-bold mb-4">Are you sure you want to delete this product?</h3>
                    <div class="flex justify-between">
                        <button @click="deleteProduct()" class="text-red-600 hover:underline">Delete</button>
                        <button @click="showConfirmDelete = false"
                            class="bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isLoggingOut" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <svg class="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span class="text-emerald-700 font-medium">Logging out...</span>
        </div>
    </div>

    <div v-if="showConfirmDelete" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="text-xl font-bold mb-4 text-red-600">Confirm Deletion</h3>
            <p class="mb-4">Are you sure you want to delete <strong>{{ productToDelete?.name }}</strong>?</p>
            <div class="flex justify-between">
                <button @click="deleteProduct" class="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                    Yes, Delete
                </button>
                <button @click="showConfirmDelete = false" class="bg-gray-300 text-black py-2 px-4 rounded-lg">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Edit Product -->
    <div v-if="showEditModal" class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 class="text-xl font-bold mb-4">Edit Product</h3>
            <form @submit.prevent="handleEditProduct">
                <div class="mb-4">
                    <input v-model="productToEdit.name" type="text" placeholder="Product Name"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required />
                </div>
                <div class="mb-4">
                    <input v-model="productToEdit.quantity" type="number" placeholder="Product Quantity"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required />
                </div>
                <div class="flex justify-between">
                    <button type="submit" class="bg-emerald-600 text-white py-2 px-4 rounded-lg">Save Changes</button>
                    <button @click="showEditModal = false"
                        class="bg-gray-300 text-black py-2 px-4 rounded-lg">Cancel</button>
                </div>
            </form>
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import axios from 'axios'


onMounted(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
        router.replace('/')
    } else {
        fetchProductsFromAPI()
    }
})

const router = useRouter()

interface Product {
    id: number;
    name: string;
    quantity: number;
    created_at: string;
}

const products = ref<Product[]>([])
const newProduct = ref({ name: '', quantity: 0 })
const searchQuery = ref('')
const sortOrder = ref('nameAsc')
const showCreateModal = ref(false)
const showConfirmDelete = ref(false)
const productToDelete = ref<Product | null>(null)
const currentPage = ref(1)
const itemsPerPage = 5
const token = localStorage.getItem('accessToken')

const fetchProductsFromAPI = async () => {

    try {
        const response = await axios.get('http://localhost:3000/v.01/product?page=1&pageSize=10&id=0&search', {
            headers: {
                'X-API-KEY': 'pnm',
                'Authorization': `Bearer ${token}`,
            }
        })

        const apiData = response.data.data.data

        products.value = apiData.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.jumlah,
            created_at: item.created_at
        }))
    } catch (error) {
        console.error('Failed to fetch products:', error)
    }
}

const addProduct = async (name: string, quantity: number) => {
    const newProductItem = {
        id: products.value.length + 1,
        name,
        quantity,
        created_at: new Date().toISOString(),
    }

    products.value.push(newProductItem)

    try {
        await axios.post('http://localhost:3000/v.01/product/create', {
            name,
            jumlah: quantity
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'pnm',
                'Authorization': `Bearer ${token}`,
            }
        })
        console.log('Produk berhasil dikirim ke backend.')
    } catch (error) {
        console.error('Gagal mengirim produk ke backend:', error)
    }
}

const handleCreateProduct = () => {
    if (newProduct.value.name && newProduct.value.quantity > 0) {
        addProduct(newProduct.value.name, newProduct.value.quantity)
    }
    newProduct.value = { name: '', quantity: 0 }
    showCreateModal.value = false
}

const confirmDelete = (product: Product) => {
    productToDelete.value = product
    showConfirmDelete.value = true
}

const deleteProduct = async () => {
    if (!productToDelete.value) return

    try {
        const response = await fetch('http://localhost:3000/v.01/product/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'pnm',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                id: productToDelete.value.id,
                name: productToDelete.value.name,
                jumlah: productToDelete.value.quantity
            })
        })

        if (!response.ok) {
            throw new Error('Gagal menghapus produk')
        }

        const index = products.value.findIndex(p => p.id === productToDelete.value.id)
        if (index !== -1) {
            products.value.splice(index, 1)
        }

        showConfirmDelete.value = false
        productToDelete.value = null
    } catch (error) {
        console.error('Error saat menghapus produk:', error)
    }
}

const filteredProducts = computed(() => {
    let result = products.value.filter(product => product.name.toLowerCase().includes(searchQuery.value.toLowerCase()))

    if (sortOrder.value === 'nameAsc') {
        result = result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder.value === 'nameDesc') {
        result = result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortOrder.value === 'createdAsc') {
        result = result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortOrder.value === 'createdDesc') {
        result = result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return result
})

const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredProducts.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => {
    return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}
const isLoggingOut = ref(false)

const logout = () => {
    isLoggingOut.value = true
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    setTimeout(() => {
        isLoggingOut.value = false
        router.replace('/')
    }, 1500)
}

const showEditModal = ref(false) // Flag untuk menampilkan modal edit
const productToEdit = ref<Product | null>(null) // Produk yang sedang diedit

const editProduct = (product: Product) => {
    productToEdit.value = { ...product } // Menyalin data produk ke object yang bisa diedit
    showEditModal.value = true
}

const handleEditProduct = async () => {
    if (productToEdit.value) {
        const updatedProduct = {
            id: productToEdit.value.id,
            name: productToEdit.value.name,
            jumlah: productToEdit.value.quantity,
        }

        try {
            await axios.put('http://localhost:3000/v.01/product/update', updatedProduct, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'pnm',
                    'Authorization': `Bearer ${token}`,
                },
            })

            // Update data produk di tampilan setelah berhasil
            const index = products.value.findIndex(p => p.id === updatedProduct.id)
            if (index !== -1) {
                products.value[index] = {
                    ...products.value[index],
                    name: updatedProduct.name,
                    quantity: updatedProduct.jumlah
                }
            }

            showEditModal.value = false
            productToEdit.value = null
            console.log('Produk berhasil diupdate.')
        } catch (error) {
            console.error('Gagal mengupdate produk:', error)
        }
    }
}



</script>

<style scoped></style>