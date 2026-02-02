import { jest } from '@jest/globals';

export const mockRepository = (methods) => {
  const mock = {};
  for (const [methodName, implementation] of Object.entries(methods)) {
    mock[methodName] = jest.fn(implementation);
  }
  return mock;
};

export const resetAllMocks = (mocks) => {
  Object.values(mocks).forEach(mock => {
    if (mock.mockClear) {
      mock.mockClear();
    }
  });
};

export const expectError = async (fn, errorMessage) => {
  await expect(fn).rejects.toThrow(errorMessage);
};

export const createMockFile = (filename = 'test.jpg') => ({
  fieldname: 'image',
  originalname: filename,
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'public/images/products',
  filename: `${Date.now()}-${filename}`,
  path: `public/images/products/${Date.now()}-${filename}`,
  size: 12345
});

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
