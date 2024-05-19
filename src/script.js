const app = Vue.createApp({
    data() {
        return {
            searchInput: '',
            currentPage: 1,
            totalPages: 0,
            posts: [],
            loadingImages: false,
            pageInput: '',
            showModal: false,
            fullImageUrl: '' 
        };
    },
    computed: {
        filteredPosts() {
            return this.posts.filter(post =>
                post.tag_string.includes(this.searchInput) && (post.rating === "g" || post.rating === "s")
            );
        }
    },
    methods: {
        async fetchData(page) {
            try {
                this.loadingImages = true;
                const response = await fetch(`https://danbooru.donmai.us/posts.json?page=${page}`);
                const data = await response.json();
                this.posts = data; 
                this.totalPages = 1000;
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                this.loadingImages = false;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchData(this.currentPage);
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchData(this.currentPage);
            }
        },
        goToPage() {
            const page = parseInt(this.pageInput, 10);
            if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.fetchData(this.currentPage);
            } else {
                alert('Please only enter a valid number between 1 and ' + this.totalPages);
            }
        },
        openImage(url) {
            this.fullImageUrl = url;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.fullImageUrl = '';
        }
    },
    mounted() {
        this.fetchData(this.currentPage);
    }
});

const mountedApp = app.mount('#app');
