import { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId,
    updateCategoryAssignments 
} from '../models/categories.js';
import { 
    getProjectsByCategoryId,
    getProjectDetails 
} from '../models/projects.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (err) {
        next(err);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (err) {
        next(err);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const allCategories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);
        const title = 'Assign Categories to Project';

        res.render('assign-categories', {
            title,
            project,
            allCategories,
            assignedCategories
        });
    } catch (err) {
        next(err);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const { categoryIds } = req.body;

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Categories updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
