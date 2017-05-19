import { Router } from 'express';
import * as SubmissionController from '../controllers/submission.controller';

const router = new Router();

// Get all Users
//router.route('/submissions').get(SubmissionController.getUsers);

// Get submission
router.route('/projects/submission/:cuid').get(SubmissionController.getSubmission);

export default router;