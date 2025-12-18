// Константы
const API_BASE = '/api/organizations';

// Элементы DOM
const addOrgBtn = document.getElementById('addOrgBtn');
const addOrgModal = document.getElementById('addOrgModal');
const closeModal = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const createOrgBtn = document.getElementById('createOrgBtn');
const newOrgName = document.getElementById('newOrgName');
const newOrgContent = document.getElementById('newOrgContent');

const editBtn = document.getElementById('editBtn');
const editBtnTop = document.getElementById('editBtnTop'); // Кнопка редактирования на странице организации
const deleteBtn = document.getElementById('deleteBtn');
const deleteBtnTop = document.getElementById('deleteBtnTop'); // Кнопка удаления в шапке
const deleteOrgModal = document.getElementById('deleteOrgModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteOrgSelect = document.getElementById('deleteOrgSelect');
const deleteOrgId = document.getElementById('deleteOrgId');
const deleteOrgName = document.getElementById('deleteOrgName');
const followBtn = document.getElementById('followBtn'); // Кнопка "Следить"
const followBtnTop = document.getElementById('followBtnTop'); // Кнопка "Следить" в шапке
const menuBtn = document.getElementById('menuBtn'); // Кнопка меню "..."
const exportBtn = document.getElementById('exportBtn');
const exportMenu = document.getElementById('exportMenu');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

const pageContent = document.getElementById('pageContent');
const editForm = document.getElementById('editForm');
const orgNameInput = document.getElementById('orgNameInput');
const orgContentInput = document.getElementById('orgContentInput');
const currentOrgId = document.getElementById('currentOrgId');

// Показать модальное окно создания организации
if (addOrgBtn) {
    addOrgBtn.addEventListener('click', () => {
        addOrgModal.style.display = 'flex';
        newOrgName.value = '';
        newOrgContent.value = '';
        newOrgName.focus();
    });
}

// Закрыть модальное окно
if (closeModal) {
    closeModal.addEventListener('click', () => {
        addOrgModal.style.display = 'none';
    });
}

if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', () => {
        addOrgModal.style.display = 'none';
    });
}

// Закрыть модальное окно при клике вне его
if (addOrgModal) {
    addOrgModal.addEventListener('click', (e) => {
        if (e.target === addOrgModal) {
            addOrgModal.style.display = 'none';
        }
    });
}

// Создать новую организацию
if (createOrgBtn) {
    createOrgBtn.addEventListener('click', async () => {
        const name = newOrgName.value.trim();
        
        if (!name) {
            alert('Пожалуйста, введите название организации');
            return;
        }
        
        try {
            const response = await fetch(API_BASE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    content: newOrgContent.value
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                alert(data.error || 'Ошибка создания организации');
                return;
            }
            
            // Перенаправить на созданную организацию
            window.location.href = `/wiki/organization/${data.id}`;
            
        } catch (error) {
            console.error('Ошибка создания организации:', error);
            alert('Ошибка соединения с сервером');
        }
    });
}

// Переключить режим редактирования (кнопка на странице организации)
if (editBtnTop && pageContent && editForm) {
    editBtnTop.addEventListener('click', () => {
        pageContent.style.display = 'none';
        editForm.style.display = 'block';
        if (orgContentInput) orgContentInput.focus();
    });
}

// Переключить режим редактирования (старая кнопка, если есть)
if (editBtn && pageContent && editForm) {
    editBtn.addEventListener('click', () => {
        const isEditing = editForm.style.display === 'block';
        if (isEditing) {
            editForm.style.display = 'none';
            pageContent.style.display = 'block';
        } else {
            pageContent.style.display = 'none';
            editForm.style.display = 'block';
            if (orgContentInput) orgContentInput.focus();
        }
    });
}

// Отменить редактирование
if (cancelBtn && pageContent && editForm) {
    cancelBtn.addEventListener('click', () => {
        editForm.style.display = 'none';
        pageContent.style.display = 'block';
    });
}

// Кнопка "Следить" (заглушка)
if (followBtn) {
    followBtn.addEventListener('click', () => {
        alert('Функция "Следить" будет добавлена позже');
    });
}

// Кнопка "Следить" в шапке (заглушка)
if (followBtnTop) {
    followBtnTop.addEventListener('click', () => {
        alert('Функция "Следить" будет добавлена позже');
    });
}

// Кнопка меню "..." (заглушка)
if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        alert('Дополнительное меню будет добавлено позже');
    });
}

// Сохранить изменения
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        const id = currentOrgId.value;
        const name = orgNameInput.value.trim();
        const content = orgContentInput.value;
        
        if (!name) {
            alert('Название организации не может быть пустым');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, content })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                alert(data.error || 'Ошибка обновления организации');
                return;
            }
            
            // Перезагрузить страницу для отображения изменений
            window.location.reload();
            
        } catch (error) {
            console.error('Ошибка обновления организации:', error);
            alert('Ошибка соединения с сервером');
        }
    });
}

// Удалить организацию
async function deleteOrganization() {
    const id = currentOrgId ? currentOrgId.value : null;
    const orgTitle = document.getElementById('orgTitle');
    const orgName = orgTitle ? orgTitle.textContent : 'эту организацию';
    
    if (!id) {
        alert('Не удалось определить ID организации');
        return;
    }
    
    if (!confirm(`Вы уверены, что хотите удалить организацию "${orgName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Ошибка удаления организации');
            return;
        }
        
        // Перенаправить на страницу wiki
        window.location.href = '/wiki';
        
    } catch (error) {
        console.error('Ошибка удаления организации:', error);
        alert('Ошибка соединения с сервером');
    }
}

// Показать модальное окно удаления
if (deleteBtnTop) {
    deleteBtnTop.addEventListener('click', () => {
        deleteOrgModal.style.display = 'flex';
    });
}

// Закрыть модальное окно удаления
if (closeDeleteModal) {
    closeDeleteModal.addEventListener('click', () => {
        deleteOrgModal.style.display = 'none';
    });
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
        deleteOrgModal.style.display = 'none';
    });
}

// Подтвердить удаление
if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async () => {
        let orgId = null;
        let orgName = '';
        
        // Если есть выбранная организация (на странице организации)
        if (deleteOrgId && deleteOrgId.value) {
            orgId = deleteOrgId.value;
            orgName = deleteOrgName ? deleteOrgName.textContent : 'эту организацию';
        } 
        // Если на странице списка (выбор из dropdown)
        else if (deleteOrgSelect && deleteOrgSelect.value) {
            orgId = deleteOrgSelect.value;
            orgName = deleteOrgSelect.options[deleteOrgSelect.selectedIndex].text;
        } else {
            alert('Выберите организацию для удаления');
            return;
        }
        
        if (!confirm(`Вы уверены, что хотите удалить организацию "${orgName}"?`)) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/${orgId}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                alert(data.error || 'Ошибка удаления организации');
                return;
            }
            
            // Закрыть модальное окно
            deleteOrgModal.style.display = 'none';
            
            // Перенаправить на страницу wiki
            window.location.href = '/wiki';
            
        } catch (error) {
            console.error('Ошибка удаления организации:', error);
            alert('Ошибка соединения с сервером');
        }
    });
}

// Удаление из страницы организации (старая кнопка)
if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteOrganization);
}

// Показать/скрыть меню экспорта
if (exportBtn) {
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportMenu.classList.toggle('show');
    });
    
    // Закрыть меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!exportBtn.contains(e.target) && !exportMenu.contains(e.target)) {
            exportMenu.classList.remove('show');
        }
    });
}

// Enter для создания организации
if (newOrgName) {
    newOrgName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createOrgBtn.click();
        }
    });
}

// Ctrl+S для сохранения
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (saveBtn && editForm.style.display !== 'none') {
            saveBtn.click();
        }
    }
});

// Переключение сайдбара на мобильных
const wikiMenuToggle = document.getElementById('wikiMenuToggle');
const wikiSidebarLeft = document.querySelector('.wiki-sidebar-left');

if (wikiMenuToggle && wikiSidebarLeft) {
    wikiMenuToggle.addEventListener('click', () => {
        wikiSidebarLeft.classList.toggle('active');
    });

    // Закрыть сайдбар при клике вне его
    document.addEventListener('click', (e) => {
        if (!wikiSidebarLeft.contains(e.target) && !wikiMenuToggle.contains(e.target) && wikiSidebarLeft.classList.contains('active')) {
            wikiSidebarLeft.classList.remove('active');
        }
    });
}


