import { test, expect, chromium } from '@playwright/test';

test.use({
  viewport: {
    width: 1920,
    height: 1080    
  }
});

test('Smoke Test', async () => {

  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: "./test-results"
    }
  })

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/home');

  console.log('Add Dataset')
  await page.getByText('Models & Data').click();
  await page.getByTestId('open-dataset-list-button').locator('span').click();
  await page.getByTestId('add-new-datasets-button').click();
  await page.getByText('Click to Browse').click();
  await page.locator("input[name='file-dropbox']").setInputFiles('./fixtures/pickle_pandas_mock_binary_classification_credit_risk_testing.sav');
  await page.getByTestId('upload-datasets-button').click();
  await page.getByRole('button', { name: 'Back to all Datasets >' }).click();
  await page.getByTestId('datasets-back-button').click();
  
  console.log('Add Model')
  await page.getByTestId('open-model-list-button').locator('span').click();
  await page.getByTestId('add-new-models-button').click();
  await page.getByText('Upload AI Model').click();
  await page.getByTestId('newmodel-next-button').click();
  await page.getByText('Click to Browse').click();
  await page.locator("input[name='file']").setInputFiles('./fixtures/binary_classification_mock_credit_risk_sklearn.linear_model._logistic.LogisticRegression.sav');
  await page.getByTestId('upload-models-button').click();
  await page.getByRole('button', { name: 'Back to all Models >' }).click();
  await page.getByRole('img', { name: 'AI Verify' }).click();

  console.log('Create A Project')
  await page.getByTestId('new-project-button').getByText('Create New Project').click();
  await page.getByPlaceholder('Enter name of this project e.g. Credit Scoring Model Tests').click();
  await page.getByPlaceholder('Enter name of this project e.g. Credit Scoring Model Tests').fill('Testing the credit model');
  await page.getByPlaceholder('Enter Project Description e.g. To test whether the classification model is fair towards all groups with respect to gender, robust against unexpected input and explainable.').click();
  await page.getByPlaceholder('Enter Project Description e.g. To test whether the classification model is fair towards all groups with respect to gender, robust against unexpected input and explainable.').fill('To test how the credit model aligns with the AI Verify Testing Framework');
  await page.getByPlaceholder('Enter the title to be used for the generated report').click();
  await page.getByLabel('Report TitleUse Project Name').check();
  await page.getByPlaceholder('Enter the company name').click();
  await page.getByPlaceholder('Enter the company name').fill('Fake Company Pte Ltd');
  await page.locator('div:nth-child(4) > .header_reportNavBtn__0fDU_').click();

  console.log('Select Template')
  await page.getByText('AI Verify Summary Report for Classification ModelAI Verify Summary Report for Cl').click();
  await page.locator('div:nth-child(4) > .header_reportNavBtn__0fDU_').click();
  await page.getByRole('button', { name: 'Global Variables' }).click();
  await page.locator('div:nth-child(4) > .header_reportNavBtn__0fDU_').click();
  // await page.locator('#varkey-modelName').getByText('User input model name').click();
  // await page.getByTestId('CloseIcon').click();
  // await page.getByRole('textbox').nth(2).click();
  // await page.getByRole('textbox').nth(2).type('modelName');
  // await page.getByRole('textbox').nth(2).click();
  // await page.getByRole('textbox').nth(3).type('Binary Classification Model for Credit Risk');
  // await page.locator('#globalVars button').click();
  // await page.getByTestId('CloseIcon').click();
  // await page.getByRole('textbox').nth(2).click();
  // await page.getByRole('textbox').nth(2).fill('modelPurpose');
  // await page.getByRole('textbox').nth(2).press('Tab');
  // await page.getByRole('textbox').nth(3).fill('default the loan');
  // await page.locator('#globalVars button').click();
  // await page.locator('.reportWidget_widgetContainer__fenJf > div > div > div:nth-child(2)').click();
  // await page.locator('#gridItemActionMenu').getByRole('button').nth(1).click();
  // await page.getByRole('button', { name: '{company}' }).click();
  // await page.locator('div:nth-child(5) > .listMenu_menuItemContent__Ey0jN').click();
  // await page.getByRole('button', { name: '{modelName}' }).nth(1).click();
  // await page.locator('#widgetPropertiesDialog div').filter({ hasText: 'company' }).nth(2).click();
  // await page.getByRole('button', { name: 'OK' }).click();
  // await page.locator('div:nth-child(4) > .header_reportNavBtn__0fDU_').click();
  // await page.locator('div:nth-child(4) > .header_reportNavBtn__0fDU_').click();

  console.log('Select Dataset & Ground Truth')
  await page.getByRole('button', { name: 'Choose Dataset' }).first().click();
  await page.getByText('pickle_pandas_mock_binary_classification_credit_risk_testing.sav').click();
  await page.getByRole('button', { name: 'Use Dataset' }).click();
  await page.getByRole('button', { name: 'Choose Dataset' }).click();
  await page.getByText('pickle_pandas_mock_binary_classification_credit_risk_testing.sav').click();
  await page.getByRole('button', { name: 'Use Dataset' }).click();
  await page.getByRole('button', { name: '​' }).click();
  await page.getByRole('option', { name: 'default' }).click();

  console.log('Select Model')
  await page.getByRole('button', { name: 'Choose Model' }).click();
  await page.getByText('binary_classification_mock_credit_risk_sklearn.linear_model._logistic.LogisticRe').click();
  await page.getByRole('button', { name: 'Use Model' }).click();

  console.log('SHAP ToolBox')
  await page.locator('[id="algocard-aiverify\\.stock\\.shap_toolbox\\:shap_toolbox"]').getByRole('button', { name: 'Open' }).click();
  await page.getByRole('button', { name: 'Path of the Background Path ​' }).click();
  await page.getByRole('listbox', { name: 'Path of the Background Path' }).click();

  // await page.getByRole('option', { name: '/home/benflop/GitHub/aiverify/setup-aiverify/aiverify-dev/aiverify/uploads/data/pickle_pandas_mock_binary_classification_credit_risk_testing.sav' }).click();
  await page.getByLabel('Size of the Background *').click();
  await page.getByLabel('Size of the Background *').press('End');
  await page.getByLabel('Size of the Background *').press('Insert');
  await page.getByLabel('Size of the Background *').press('Insert');
  await page.getByLabel('Size of the Background *').fill('100');
  await page.getByLabel('Size of the Test Dataset *').click();
  await page.getByLabel('Size of the Test Dataset *').fill('96');
  await page.getByRole('button', { name: 'OK' }).click();

  console.log('Robustness Toolbox')
  await page.locator('[id="algocard-aiverify\\.stock\\.robustness_toolbox\\:robustness_toolbox"]').getByRole('button', { name: 'Open' }).click();
  await page.getByRole('button', { name: 'Annotated ground truth path ​' }).click();
  await page.getByRole('listbox', { name: 'Annotated ground truth path' }).click();
  // await page.getByRole('option', { name: '/home/benflop/GitHub/aiverify/setup-aiverify/aiverify-dev/aiverify/uploads/data/pickle_pandas_mock_binary_classification_credit_risk_testing.sav' }).click();
  await page.getByLabel('Name of column containing image file names').click();
  await page.getByLabel('Name of column containing image file names').fill('default');
  await page.getByRole('button', { name: 'OK' }).click();

  console.log('Fairness Metrics Toolbox for Classification')
  await page.locator('[id="algocard-aiverify\\.stock\\.fairness_metrics_toolbox_for_classification\\:fairness_metrics_toolbox_for_classification"]').getByRole('button', { name: 'Open' }).click();
  await page.getByLabel('sensitive_feature-0 *').click();
  await page.getByLabel('sensitive_feature-0 *').fill('gender');
  await page.getByRole('button', { name: 'Add Item' }).click();
  await page.getByLabel('sensitive_feature-1 *').click();
  await page.getByLabel('sensitive_feature-1 *').fill('race');
  await page.getByRole('button', { name: 'OK' }).click();


  console.log('Transparency Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:transparency_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-1.1.1').nth(1).click();
  await page.getByTestId('completed-1.1.2').nth(1).click();
  await page.getByTestId('completed-1.2.1').nth(1).click();
  await page.getByTestId('completed-1.2.2').nth(1).click();
  await page.getByTestId('completed-1.2.3').nth(1).click();
  await page.getByTestId('completed-1.2.4').nth(1).click();
  await page.getByTestId('completed-1.2.5').nth(1).click();
  await page.getByTestId('completed-1.3.1').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Explainability Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:explainability_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-2.1.1').nth(1).click();
  await page.locator('#aivModal path').click();

  console.log('Reproducibility Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:reproducibility_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-3.1.1').nth(1).click();
  await page.getByTestId('completed-3.2.1').nth(1).click();
  await page.getByTestId('completed-3.3.1').nth(1).click();
  await page.getByTestId('completed-3.4.1').nth(1).click();
  await page.getByTestId('completed-3.5.1').nth(1).click();
  await page.getByTestId('completed-3.6.1').nth(1).click();
  await page.getByTestId('completed-3.7.1').nth(1).click();
  await page.getByTestId('completed-3.8.1').nth(1).click();
  await page.getByTestId('completed-3.9.1').nth(1).click();
  await page.getByTestId('completed-3.9.2').nth(1).click();
  await page.getByTestId('completed-3.10.1').nth(1).click();
  await page.getByTestId('completed-3.11.1').nth(1).click();
  await page.getByTestId('completed-3.12.1').nth(1).click();
  await page.getByTestId('completed-3.13.1').nth(1).click();
  await page.getByTestId('completed-3.14.1').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Safety Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:safety_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-4.1.1').nth(1).click();
  await page.getByTestId('completed-4.2.1').nth(1).click();
  await page.getByTestId('completed-4.3.1').nth(1).click();
  await page.getByTestId('completed-4.4.1').nth(1).click();
  await page.getByTestId('completed-4.5.1').nth(1).click();
  await page.getByTestId('completed-4.5.2').nth(1).click();
  await page.getByTestId('completed-4.5.3').nth(1).click();
  await page.getByTestId('completed-4.5.4').nth(1).click();
  await page.getByTestId('completed-4.6.1').nth(1).click();
  await page.locator('#aivModal path').click();

  console.log('Robustness Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:robustness_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-6.1.1').nth(1).click();
  await page.getByTestId('completed-6.2.1').nth(1).click();
  await page.getByTestId('completed-6.3.1').nth(1).click();
  await page.getByTestId('completed-6.4.1').nth(1).click();
  await page.getByTestId('completed-6.5.1').nth(1).click();
  await page.getByTestId('completed-6.5.2').nth(1).click();
  await page.getByTestId('completed-6.5.3').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Fairness Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:fairness_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-7.1.1').nth(1).click();
  await page.getByTestId('completed-7.2.1').nth(1).click();
  await page.getByTestId('completed-7.3.1').nth(1).click();
  await page.getByTestId('completed-7.4.1').nth(2).click();
  await page.getByTestId('completed-7.4.1').nth(1).click();
  await page.getByTestId('completed-7.4.2').nth(1).click();
  await page.getByTestId('completed-7.5.1').nth(1).click();
  await page.getByTestId('completed-7.6.1').nth(1).click();
  await page.getByTestId('completed-7.7.1').nth(1).click();
  await page.getByTestId('completed-7.8.1').nth(1).click();
  await page.getByTestId('completed-7.9.1').nth(1).click();
  await page.locator('#aivModal path').click();

  console.log('Accountability Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:accountability_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-9.1.1').nth(1).click();
  await page.getByTestId('completed-9.1.2').nth(1).click();
  await page.getByTestId('completed-9.1.3').nth(1).click();
  await page.getByTestId('completed-9.2.1').nth(1).click();
  await page.getByTestId('completed-9.3.1').nth(1).click();
  await page.getByTestId('completed-9.4.1').nth(1).click();
  await page.getByTestId('completed-9.5.1').nth(1).click();
  await page.getByTestId('completed-9.5.2').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Human Agency & Oversight Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:human_agency_oversight_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-10.1.1').nth(1).click();
  await page.getByTestId('completed-10.1.2').nth(1).click();
  await page.getByTestId('completed-10.2.1').nth(1).click();
  await page.getByTestId('completed-10.2.2').nth(1).click();
  await page.getByTestId('completed-10.2.3').nth(1).click();
  await page.getByTestId('completed-10.3.1').nth(1).click();
  await page.getByTestId('completed-10.4.1').nth(1).click();
  await page.getByTestId('completed-10.5.1').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Security Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:security_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-5.1.1').nth(1).click();
  await page.getByTestId('completed-5.2.1').nth(1).click();
  await page.getByTestId('completed-5.3.1').nth(1).click();
  await page.getByTestId('completed-5.3.2').nth(1).click();
  await page.getByTestId('completed-5.4.1').nth(1).click();
  await page.getByTestId('completed-5.4.2').nth(1).click();
  await page.getByTestId('completed-5.4.3').nth(1).click();
  await page.getByTestId('completed-5.4.4').nth(1).click();
  await page.getByTestId('completed-5.5.1').nth(1).click();
  await page.getByTestId('completed-5.5.2').nth(1).click();
  await page.getByTestId('completed-5.5.3').nth(1).click();
  await page.getByTestId('completed-5.6.1').nth(1).click();
  await page.getByTestId('completed-5.6.2').nth(1).click();
  await page.getByTestId('completed-5.7.1').nth(1).click();
  await page.locator('#aivModal path').click();

  console.log('Data Governance Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:data_governance_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-8.1.1').nth(1).click();
  await page.getByTestId('completed-8.2.1').nth(1).click();
  await page.getByTestId('completed-8.3.1').nth(1).click();
  await page.getByTestId('completed-8.4.1').nth(1).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();

  console.log('Inclusive Growth, Societal & Environmental Well-being Process Checklist')
  await page.locator('[id="ibcard-aiverify\\.stock\\.process_checklist\\:inclusive_growth_process_checklist"]').getByRole('button', { name: 'Open' }).click();
  await page.getByTestId('completed-11.1.1').nth(1).click();
  await page.locator('#aivModal path').click();

  console.log('Fairness Tree')
  await page.locator('[id="ibcard-aiverify\\.stock\\.fairness_metrics_toolbox_for_classification\\:fairness_tree"]').getByRole('button', { name: 'Open' }).click();
  await page.getByLabel('Sensitive Feature Name(s)*').click();
  await page.getByLabel('Sensitive Feature Name(s)*').fill('gender, race');
  await page.getByLabel('Favourable Allocated Resource / Opportunity*').click();
  await page.getByLabel('Favourable Allocated Resource / Opportunity*').fill('low interest rate');
  await page.locator('#qualified').click();
  await page.locator('#qualified').fill('qualified applicants');
  await page.getByLabel('Unqualified Group*').click();
  await page.getByLabel('Unqualified Group*').fill('unqualified applicants');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('[id="outcome-select-n1\\.2"]').check();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('a. loss of opportunity');
  await page.getByRole('textbox').press('Enter');
  await page.getByText('a. loss of opportunity').fill('a. loss of opportunity\nb. increased risk for the bank');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('textbox').click();
  await page.getByLabel('Unqualified applicants receiving the Low interest rate').check();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('It is more concerning as it is a threat to the bank if applicants are unable to repay loans');
  await page.locator('div:nth-child(3) > div > div:nth-child(2)').first().click();
  await page.getByLabel('Yes').check();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('The algorithm is heavily dependent as it is a human out-of-the-loop decision making process with little human intervention.');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('#aivModal').getByTestId('CloseIcon').click();
  await page.getByText('Next').click();
  await page.getByRole('button', { name: 'Proceed' }).click();

  console.log('Running Tests & Generating Report')
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'View Report' }).click()
  ]);
  await page.getByRole('img', { name: 'AI Verify' }).click();

  console.log('Test Complete & Report Generated')

  console.log('Clean Up')

  console.log('Delete Project')
  await page.goto('http://127.0.0.1:3000/home');
  await page.getByTestId('aiv-projectcard-delete-project').click();
  await page.getByRole('button', { name: 'Proceed' }).click();

  console.log('Delete Dataset')
  await page.getByText('Models & Data').click();
  await page.getByTestId('open-dataset-list-button').locator('span').click();
  await page.getByRole('checkbox', { name: 'Select row' }).check();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete Files' }).click();
  await page.getByTestId('datasets-back-button').click();
  
  console.log('Delete Model')
  await page.getByTestId('open-model-list-button').locator('span').click();
  await page.getByRole('checkbox', { name: 'Select all rows' }).check();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete Files' }).click();
  await page.getByRole('img', { name: 'AI Verify' }).click();

});