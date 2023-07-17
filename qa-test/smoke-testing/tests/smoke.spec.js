import { test, expect, chromium } from '@playwright/test';
import { MongoClient, ObjectId } from 'mongodb'

const uri =
  "mongodb://mongodb:mongodb@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
const mongoClient = new MongoClient(uri)
const database = mongoClient.db('aiverify')
const projects = database.collection('projecttemplatemodels');

test.use({
  ignoreHTTPSErrors: true
});

test('Smoke Test', async () => {

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: "./test-results"
    }
  })

  let randomNum = Math.random();

  const page = await context.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  const projectName = 'Project ' + randomNum
  const projectDescription = 'Project 1'
  const reportTitle = 'Report for Project 1'
  const companyName = 'Reporters'

  await page.goto('http://127.0.0.1:3000/home');

  // Add Dataset & Model
  console.log('Add Dataset')
  await page.getByText('Models & Data').click();
  await page.getByText('Datasets').click();
  await page.getByRole('button', { name: 'New Dataset +' }).click();
  await page.getByText('Click to Browse').click();
  await page.locator("input[name='file']").setInputFiles('./fixtures/pickle_pandas_tabular_loan_testing.sav');
  await page.getByRole('button', { name: 'Upload selected files >' }).click();
  await page.getByRole('button', { name: 'Back to all Datasets >' }).click();

  console.log('Add Model')
  await page.locator('.MuiButtonBase-root').first().click();
  await page.getByTestId('open-model-list-button').locator('div').filter({ hasText: 'AI Models' }).locator('div').click();
  await page.getByRole('button', { name: 'New Model +' }).click();
  await page.getByRole('button', { name: 'upload' }).click();
  await page.getByRole('button', { name: 'Next >' }).click();
  await page.getByText('Click to Browse').click();
  await page.locator("input[name='file']").setInputFiles('./fixtures/pickle_scikit_multiclasslr_loan.sav');
  await page.getByRole('button', { name: 'Upload selected files >' }).click();
  await page.getByRole('button', { name: 'Back to all Models >' }).click();
  await page.getByText('pickle_scikit_multiclasslr_loan.sav').click();
  await page.getByTestId('MenuIcon').locator('path').click();
  await page.getByText('Home').click();

  // Create a project
  console.log('Create A Project')
  await page.getByTestId('new-project-button').getByText('Test an AI Model and generate reports').click();
  await page.getByPlaceholder('Enter name of this project e.g. Credit Scoring Model Tests').fill(projectName);
  await page.getByPlaceholder('Enter Project Description e.g. To test whether the classification model is fair towards all groups with respect to gender, robust against unexpected input and explainable.').click()
  await page.getByPlaceholder('Enter Project Description e.g. To test whether the classification model is fair towards all groups with respect to gender, robust against unexpected input and explainable.').fill(projectDescription);
  await page.getByPlaceholder('Enter the title to be used for the generated report').click();
  await page.getByPlaceholder('Enter the title to be used for the generated report').fill(reportTitle);
  await page.getByPlaceholder('Enter the company name').click();
  await page.getByPlaceholder('Enter the company name').fill(companyName);
  await page.getByText('Next').click();
  await page.getByText('Blank CanvasDesign your own report by dragging widgets onto a blank canvas').click();
  await page.getByText('Next').first().click();

  // Configure Global Variables
  console.log('Configure Global Variables')
  await page.getByRole('button', { name: 'Global Variables' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('20');
  await page.getByRole('textbox').nth(2).fill('20');
  await page.locator('#globalVars button').click();

  // Drag Widgets and Process Checklist
  await page.getByRole('button', { name: 'AI Verify Process Checklist' }).click();
  await page.getByRole('region').getByTestId('DragIndicatorIcon').first().dragTo(page.locator('div.react-grid-layout'));

  // Add a page
  console.log('Add a page')
  await page.locator('button:nth-child(3)').first().click();

  // Add Process Checklist
  await page.getByRole('button', { name: 'Widgets for Fairness Metrics Toolbox' }).click();
  await page.getByText('introduction to Fairness Metrics Toolbox for Classification').first().dragTo(page.locator('div.react-grid-layout'));
  await page.locator('.react-grid-layout').click();
  await page.getByText('Next').click();

  // Input Blocks & Technical Test
  console.log('Input Blocks & Technical Test')
  await page.getByRole('button', { name: 'Choose Dataset' }).first().click();
  await page.getByText('pickle_pandas_tabular_loan_testing.sav').click();
  await page.getByRole('button', { name: 'Use Dataset' }).click();
  await page.getByRole('button', { name: 'Choose Dataset' }).click();
  await page.getByText('pickle_pandas_tabular_loan_testing.sav').click();
  await page.getByRole('button', { name: 'Use Dataset' }).click();
  await page.getByRole('button', { name: '​' }).click();
  await page.getByRole('option', { name: 'Interest_Rate' }).click();
  await page.getByRole('button', { name: 'Choose Model' }).click();
  await page.getByText('pickle_scikit_multiclasslr_loan.sav').click();
  await page.getByRole('button', { name: 'Use Model' }).click();
  await page.getByRole('button', { name: 'Open' }).first().click();
  await page.getByRole('button', { name: 'Add Item' }).click();
  await page.getByLabel('sensitive_feature-0 *').click();
  await page.getByLabel('sensitive_feature-0 *').fill('Gender');
  await page.getByLabel('sensitive_feature-1 *').click();
  await page.getByLabel('sensitive_feature-1 *').fill('Home_Owner');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByText('Next').click();

  // Input Process Checklist
  // await page.locator('[id="ibcard-aiverify\\.stock\\.process-checklist\\:fairness-process-checklist"]').getByRole('button', { name: 'Open' }).click();
  // await page.getByTestId('completed-fairness-4').first().click();
  // await page.getByTestId('completed-fairness-5').first().click();
  // await page.getByTestId('completed-fairness-5').first().click();
  // await page.getByTestId('completed-fairness-6').first().click();
  // await page.getByTestId('completed-fairness-7').first().click();
  // await page.getByRole('textbox').filter({ hasText: 'Test' }).click();
  // await page.getByTestId('completed-fairness-8').first().click();
  // await page.getByTestId('completed-fairness-9').first().click();
  // await page.getByTestId('completed-fairness-10').first().click();
  // await page.getByTestId('completed-fairness-10').first().click();
  // await page.getByTestId('completed-fairness-11').first().click();
  // await page.getByRole('button', { name: 'close' }).click();

  // Start Repoet Generation
  console.log('Report Generation')
  await page.getByRole('button', { name: 'Start Report Generation' }).click();
  await page.waitForURL('http://127.0.0.1:3000/reportStatus/*');
  await page.getByRole('button', { name: 'View Report' }).click();
  await page.getByRole('img', { name: 'AI Verify' }).click();
  // const [download] = await Promise.all([
  //   page.waitForEvent('download'),
  //   page.getByRole('link', { name: 'Save' }).click()
  // ]);

  // Get Project Info directly from MongoDB
  console.log('Asserting Values')
  const projectInfoObj = await projects.find({}).sort({ _id: -1 }).limit(1).toArray();

  // Assert Project Info
  expect(projectInfoObj[0].projectInfo.name).toBe(projectName)
  expect(projectInfoObj[0].projectInfo.description).toBe(projectDescription)
  expect(projectInfoObj[0].projectInfo.reportTitle).toBe(reportTitle)
  expect(projectInfoObj[0].projectInfo.company).toBe(companyName)
  expect(projectInfoObj[0].pages).toBeNull

  // Get Project ID
  const projectId = projectInfoObj[0]._id

  // Assert Global Variables
  expect(projectInfoObj[0].globalVars[0].key).toBe('20')
  expect(projectInfoObj[0].globalVars[0].value).toBe('20')

  // View Report
  // console.log('View Report')
  // await page.getByText(projectName).click()
  // await page.locator('div:nth-child(18) > .MuiPaper-root > div:nth-child(3) > button:nth-child(1)').click();

  // // Edit Project
  // console.log('Edit Project')
  // await page.locator('div:nth-child(18) > .MuiPaper-root > div:nth-child(3) > button:nth-child(2)').click();
  // await page.getByText('No input blocks and technical tests required for this report.').isVisible();
  // await page.getByRole('button', { name: 'Home' }).click();

  // // Clone Project
  // console.log('Clone Project')
  // await page.locator('div:nth-child(13) > .MuiPaper-root > div:nth-child(3) > button:nth-child(3)').click();

  // Delete Project
  await browser.close();

});