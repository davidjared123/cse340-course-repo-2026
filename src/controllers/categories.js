import { body, validationResult } from 'express-validator';
import { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { 
    getProjectsByCategoryId,
    getProjectDetails 
} from '../models/projects.js';

// Define validation rules for category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

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

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect('/new-category');
        }

        const { name } = req.body;
        const categoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (err) {
        next(err);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (err) {
        next(err);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach((error) => {
                req.flash('error', error.msg);
            });
            return res.redirect(`/edit-category/${categoryId}`);
        }

        const { name } = req.body;
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
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
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
};
