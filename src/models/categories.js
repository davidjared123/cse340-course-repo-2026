import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO public.project_category (project_id, category_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, category_id) DO NOTHING;
    `;
    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds = []) => {
    // First, remove existing assignments
    const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Ensure categoryIds is an array
    const ids = Array.isArray(categoryIds) ? categoryIds : (categoryIds ? [categoryIds] : []);

    // Insert new assignments
    for (const catId of ids) {
        if (catId) {
            await assignCategoryToProject(projectId, parseInt(catId, 10));
        }
    }
};

const createCategory = async (name) => {
    const query = `
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const queryParams = [name];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }
    return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const queryParams = [name, categoryId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', categoryId);
    }
    return result.rows[0].category_id;
};

export { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};
