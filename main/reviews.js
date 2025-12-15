const __reviewEditorMap = new Map();
window.__reviewEditorMap = __reviewEditorMap;

class ReviewService {
    constructor(productId) {
        this.productId = productId;
        this.token = localStorage.getItem('token');
    }

    async getReviews() {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${this.productId}/reviews`);
            return res.ok ? await res.json() : [];
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async addReview(rating, comment) {
        if (!this.token) throw new Error('Not authenticated');
        const res = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
            body: JSON.stringify({ product_id: this.productId, rating: parseInt(rating), comment })
        });
        return res.json();
    }

    async updateReview(reviewId, rating, comment) {
        if (!this.token) throw new Error('Not authenticated');
        const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token },
            body: JSON.stringify({ rating: parseInt(rating), comment })
        });
        return res.json();
    }

    async deleteReview(reviewId) {
        if (!this.token) throw new Error('Not authenticated');
        const res = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + this.token }
        });
        return res.json();
    }
}

async function renderReviews(container, productId) {
    const service = new ReviewService(productId);
    const token = localStorage.getItem('token');
    const reviews = await service.getReviews();

    let html = '<div class="reviews-section">';
    html += '<h4>Отзывы</h4>';

    if (!reviews.length) {
        html += '<p>Отзывов пока нет.</p>';
    } else {
        html += '<div class="reviews-list">';
        reviews.forEach(r => {
            const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            const isOwner = r.is_owner || (localStorage.getItem('user_id') && String(r.user_id) === String(localStorage.getItem('user_id')));
            const reviewAvatar = r.avatar || (isOwner ? localStorage.getItem('user_avatar') : null);
            const avatarHtml = reviewAvatar ? `<img src="${reviewAvatar}" class="review-avatar-img" alt="avatar">` : `<div class="review-avatar-fallback">${(r.username||'A').trim().charAt(0).toUpperCase()}</div>`;
            html += `
                <div class="review-item" data-id="${r.id}">
                    <div class="review-avatar">${avatarHtml}</div>
                    <div class="review-body">
                      <div class="review-header">
                          <strong>${r.username || 'Аноним'}</strong>
                          <span class="review-rating">${stars}</span>
                      </div>
                      <p class="review-comment">${r.comment}</p>
                      <small style="color:#999">${r.created_at}</small>
                      ${isOwner ? `<div class="review-actions" style="margin-top:6px;"><button class="btn btn-sm btn-outline-secondary review-edit">Редактировать</button> <button class="btn btn-sm btn-outline-danger review-delete">Удалить</button></div>` : ''}
                    </div>
                </div>`;
        });
        html += '</div>';
    }

    if (token) {
        html += `
            <div class="review-form">
                <h5>Оставить отзыв</h5>
                <textarea id="review-comment" placeholder="Ваш отзыв..." rows="4" style="width:100%; padding:8px; border:1px solid #eee; border-radius:6px;"></textarea>
                <div style="margin-top:8px;">
                    <label>Оценка:
                        <select id="review-rating" style="padding:6px;">
                            <option value="5">★★★★★ (5 звёзд)</option>
                            <option value="4">★★★★☆ (4 звезды)</option>
                            <option value="3">★★★☆☆ (3 звезды)</option>
                            <option value="2">★★☆☆☆ (2 звезды)</option>
                            <option value="1">★☆☆☆☆ (1 звезда)</option>
                        </select>
                    </label>
                </div>
                <button id="review-submit" class="btn btn-primary" style="margin-top:8px;">Отправить отзыв</button>
            </div>`;
    } else {
        html += '<p><a href="/login.html">Войдите</a>, чтобы оставить отзыв.</p>';
    }

    html += '</div>';
    container.innerHTML = html;

    if (token) {

        if (container._reviewsClickHandler) container.removeEventListener('click', container._reviewsClickHandler);
        const reviewClickHandler = async (ev) => {
            const el = ev.target;
            if (el && el.id === 'review-submit') {
                ev.preventDefault();
                const commentEl = document.getElementById('review-comment');
                const ratingEl = document.getElementById('review-rating');
                const comment = commentEl ? commentEl.value.trim() : '';
                const rating = ratingEl ? ratingEl.value : '5';
                if (!comment) { alert('Введите текст отзыва'); return; }
                try {
                    const res = await service.addReview(rating, comment);
                    if (res.message) {
                        alert('Отзыв добавлен');
                        await renderReviews(container, productId);
                    } else {
                        alert(res.error || 'Ошибка');
                    }
                } catch (err) { console.error(err); alert('Ошибка'); }
                return;
            }
            
            const item = el.closest('.review-item');
            if (!item) return;
            const reviewId = item.getAttribute('data-id');

            if (el.classList.contains('review-delete')) {
                if (!confirm('Удалить отзыв?')) return;
                try {
                    const res = await service.deleteReview(reviewId);
                    if (res.message) {
                        alert('Отзыв удалён');
                        await renderReviews(container, productId);
                    } else {
                        alert(res.error || 'Ошибка');
                    }
                } catch (err) { console.error(err); alert('Ошибка'); }
            }

            if (el.classList.contains('review-edit')) {
                if (__reviewEditorMap.has(reviewId)) return;
                const commentP = item.querySelector('.review-comment');
                const oldText = commentP ? commentP.textContent : '';
                const editor = document.createElement('div');
                editor.className = 'review-editor';
                editor.innerHTML = `<textarea class="form-control edit-comment" rows="3">${oldText}</textarea><div style="margin-top:6px;"><select class="form-select edit-rating" style="width:120px;display:inline-block;margin-right:8px;"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select><button class="btn btn-sm btn-primary save-edit">Сохранить</button> <button class="btn btn-sm btn-secondary cancel-edit">Отменить</button></div>`;
                if (commentP) commentP.style.display = 'none';
                item.appendChild(editor);
                __reviewEditorMap.set(reviewId, editor);

                const currentStars = item.querySelector('.review-rating').textContent || '';
                const currentRating = (currentStars.match(/★/g) || []).length || 5;
                editor.querySelector('.edit-rating').value = currentRating;

                editor.addEventListener('click', async (e2)=>{
                    const t = e2.target;
                    if (t.classList.contains('cancel-edit')) {
                        editor.remove();
                        if (commentP) commentP.style.display = '';
                        __reviewEditorMap.delete(reviewId);
                    }
                    if (t.classList.contains('save-edit')) {
                        const newComment = editor.querySelector('.edit-comment').value.trim();
                        const newRating = editor.querySelector('.edit-rating').value;
                        if (!newComment) { alert('Комментарий не может быть пустым'); return; }
                        try {
                            const res = await service.updateReview(reviewId, newRating, newComment);
                            if (res.message) {
                                alert('Отзыв обновлён');
                                __reviewEditorMap.delete(reviewId);
                                await renderReviews(container, productId);
                            } else {
                                alert(res.error || 'Ошибка');
                            }
                        } catch (err) { console.error(err); alert('Ошибка'); }
                    }
                });
            }
        };
        container.addEventListener('click', reviewClickHandler);
        container._reviewsClickHandler = reviewClickHandler;
    }
}
