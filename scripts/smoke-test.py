import unittest
import sys
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options


class SmokeTests(unittest.TestCase):
  """
  Run smoke tests on the finished production build
  """
  TEST_FILE = None

  def setUp(self):
    """
    Use a remote driver in docker running Chrome
    """
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    self.driver = webdriver.Chrome(options=chrome_options)
    # If running in docker, use the following:
    #self.driver = webdriver.Remote(command_executor='http://127.0.0.1:4444/wd/hub',
    #                              desired_capabilities=DesiredCapabilities.CHROME,
    #                              keep_alive=True)

  def test_local_file(self):
    """
    Ensure the homepage of the react app renders properly
    """
    driver = self.driver
    driver.get(f"file:///{self.TEST_FILE}")
    self.assertEqual("React App", driver.title)
    elem = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[1]/div[1]/label')
    self.assertEqual("Select a CSV file:", elem.text)

  def test_input_on_homepage(self):
    """
    Ensure the file input button for CSVs exists
    """
    driver = self.driver
    driver.get(f"file:///{self.TEST_FILE}")
    elem = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[1]/div[1]/input')
    self.assertEqual("file", elem.get_attribute("type"))

  def test_adding_csv(self):
    """
    Mock adding a test CSV and ensure the timeline is rendered properly
    """
    driver = self.driver
    driver.get(f"file:///{self.TEST_FILE}")
    elem = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[1]/div[1]/input')
    elem.send_keys(os.getcwd() + "/scripts/test.csv")

    # Check for the bar graph
    bar_graph = driver.find_elements_by_class_name("bar")
    self.assertNotEqual(0, len(bar_graph))

    # Ensure the switch to interval timeline exists
    switch_button = driver.find_element_by_xpath('//*[@id="root"]/div/div/div[2]/div/div/div/div/div[1]/button')
    self.assertEqual("Switch to Interval Timeline", switch_button.text)

    # Ensure a y-axis dropdown exists
    dropdown_button = driver.find_elements_by_id("ySelect")
    self.assertNotEqual(0, len(dropdown_button))

  def tearDown(self):
    self.driver.close()


if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("USAGE: [HTML File]")
    exit(1)

  SmokeTests.TEST_FILE = sys.argv.pop()
  SmokeTests.TEST_FILE = os.getcwd() + "/" + SmokeTests.TEST_FILE
  # If running in docker use the following:
  #SmokeTests.TEST_FILE = "/mnt/" + SmokeTests.TEST_FILE

  unittest.main()
