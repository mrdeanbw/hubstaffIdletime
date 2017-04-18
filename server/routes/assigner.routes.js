import { Router } from 'express';
import * as AssignerController from '../controllers/assigner.controller';

const router = new Router();

// Get all Accounts
router.route('/projects/list/:cuid').get(AssignerController.getProjects);

// Post submissions to projects
router.route('/projects').post(AssignerController.postProjects);

// Get submission position in wait list
router.route('/projects/positions/:submissionId/:cuid').get(AssignerController.getPositions);

// Get submission
router.route('/projects/submission/:cuid').get(AssignerController.getSubmission);

// Cancel submission 
router.route('/projects/cancel/:submissionId/:cuid').get(AssignerController.cancel);

// Notify user of assigned project 
router.route('/projects/notify/:projectId/:cuid').get(AssignerController.notify);

// Refresh submission 
router.route('/projects/refresh/:submissionId/:cuid').get(AssignerController.refresh);

// Get assignment Accounts
router.route('/projects/assigncount/:cuid').get(AssignerController.getAssignCount);

export default router;
