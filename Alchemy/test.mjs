
function test(description) {
    console.log(description);
  
    return {
      isEqual,
      dosNotThrowError,
      isInRange
    };
  }
  
  function dosNotThrowError(testFunction, description) {
    try {
      testFunction();
      console.log(`🟢 ${description}`);
    } catch (error) {
      console.error(error);
      console.log(`🔴 ${description}`);
    }
  }
  
  function isInRange(received, lowerBound, upperBound, description) {
    if (received >= lowerBound && received <= upperBound) {
      console.log(`🟢 ${description}`);
    } else {
      console.log(`🔴 ${description}. Expected range [${lowerBound}, ${upperBound}], received ${received}`);
    }
  }
  
  function isEqual(received, expected, description) {
    if (received === expected) {
      console.log(`🟢 ${description}`);
    } else {
      console.log(`🔴 ${description}. Expected ${expected}, received ${received}`);
    }
  }
  
  export default test;
  