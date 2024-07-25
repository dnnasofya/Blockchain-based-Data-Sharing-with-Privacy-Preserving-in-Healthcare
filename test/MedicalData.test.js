const MedicalData = artifacts.require("MedicalData");

contract("MedicalData", accounts => {
  it("should allow a patient to add a medical record", async () => {
    const medicalDataInstance = await MedicalData.deployed();
    await medicalDataInstance.addRecord("Record Data", "Description", "ImageHash", { from: accounts[0] });
    const records = await medicalDataInstance.getRecords(accounts[0]);
    assert.equal(records.length, 1, "Record was not added");
  });

  it("should allow a doctor to request access to patient data", async () => {
    const medicalDataInstance = await MedicalData.deployed();
    await medicalDataInstance.requestAccess(accounts[0], { from: accounts[1] });
    // Check for event emitted or another state change
  });

  it("should allow a patient to grant access to a doctor", async () => {
    const medicalDataInstance = await MedicalData.deployed();
    await medicalDataInstance.grantAccess(accounts[1], { from: accounts[0] });
    const records = await medicalDataInstance.getRecords(accounts[0], { from: accounts[1] });
    assert.equal(records.length, 1, "Access was not granted");
  });

  it("should allow a patient to revoke access from a doctor", async () => {
    const medicalDataInstance = await MedicalData.deployed();
    await medicalDataInstance.revokeAccess(accounts[1], { from: accounts[0] });
    try {
      await medicalDataInstance.getRecords(accounts[0], { from: accounts[1] });
      assert.fail("Access was not revoked");
    } catch (error) {
      assert(error.message.includes("Access not granted"), "Expected access not granted error");
    }
  });
});
