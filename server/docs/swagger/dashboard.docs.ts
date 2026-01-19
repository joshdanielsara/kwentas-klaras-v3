/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics and data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 25
 *                       description: Total number of users in the system
 *                     activeProjects:
 *                       type: number
 *                       example: 12
 *                       description: Number of active projects (current year or later)
 *                     totalBudget:
 *                       type: number
 *                       example: 5000000.00
 *                       description: Total budget across all projects (appropriation + added budgets)
 *                     totalApprovedDisbursements:
 *                       type: number
 *                       example: 2500000.00
 *                       description: Total amount of approved disbursements
 *                     totalObligations:
 *                       type: number
 *                       example: 3000000.00
 *                       description: Total amount of obligations
 *                     utilizationRate:
 *                       type: number
 *                       example: 65.5
 *                       description: Average utilization rate across all projects (percentage)
 *                     recentActivities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           projectId:
 *                             type: string
 *                           action:
 *                             type: string
 *                           description:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                 utilizationData:
 *                   type: array
 *                   description: Utilization rate distribution data for chart
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "Active (50-99%)"
 *                       value:
 *                         type: number
 *                         example: 65
 *                         description: Percentage of projects in this category
 *                       color:
 *                         type: string
 *                         example: "#2563EB"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch dashboard data"
 */
