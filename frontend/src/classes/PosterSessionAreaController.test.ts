import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { PosterSessionArea } from '../generated/client';
import TownController from './TownController';
import PosterSessionAreaController, {
  PosterSessionAreaEvents,
} from './PosterSessionAreaController';

describe('PosterSessionAreaController', () => {
  // A valid PosterSessionArea to be reused within the tests
  let testArea: PosterSessionAreaController;
  let testAreaModel: PosterSessionArea;
  const townController: MockProxy<TownController> = mock<TownController>();
  const mockListeners = mock<PosterSessionAreaEvents>();
  beforeEach(() => {
    testAreaModel = {
      id: nanoid(),
      title: nanoid(),
      imageContents: nanoid(),
      stars: 1,
    };
    testArea = new PosterSessionAreaController(testAreaModel);
    mockClear(townController);
    mockClear(mockListeners.posterImageContentsChange);
    mockClear(mockListeners.posterStarChange);
    mockClear(mockListeners.posterTitleChange);
    testArea.addListener('posterTitleChange', mockListeners.posterTitleChange);
    testArea.addListener('posterImageContentsChange', mockListeners.posterImageContentsChange);
    testArea.addListener('posterStarChange', mockListeners.posterStarChange);
  });

  describe('title', () => {
    it('Correctly set and gets the title of the PosterSessionArea', () => {
      const newTitle = 'title';
      testArea.title = newTitle;
      expect(mockListeners.posterTitleChange).toBeCalledWith(newTitle);
      expect(testArea.title).toEqual(newTitle);
    });

    it('No event is emitted if title unchanged', () => {
      const sameTitle = testArea.title;
      testArea.title = sameTitle;
      expect(mockListeners.posterTitleChange).not.toBeCalled();
      expect(testArea.title).toEqual(sameTitle);
    });
  });
  describe('imageContents', () => {
    it('Correctly set and gets the imageContents of the PosterSessionArea', () => {
      const newImageContents = 'imageContents';
      testArea.imageContents = newImageContents;
      expect(mockListeners.posterImageContentsChange).toBeCalledWith(newImageContents);
      expect(testArea.imageContents).toEqual(testAreaModel.imageContents);
      expect(testArea.playersWhoStarred).toEqual([]);
    });
  });

  describe('stars', () => {
    it('Correctly set and gets the stars of the PosterSessionArea', () => {
      const newStars = 5;
      testArea.stars = newStars;
      expect(mockListeners.posterStarChange).toBeCalledWith(newStars);
      expect(testArea.stars).toEqual(newStars);
    });
    it('No event is emitted if stars unchanged', () => {
      const sameStars = testArea.stars;
      testArea.stars = sameStars;
      expect(mockListeners.posterStarChange).not.toBeCalled();
      expect(testArea.stars).toEqual(sameStars);
    });
  });

  describe('toPosterSessionAreaModel', () => {
    it('Correctly gets the current state of the model', () => {
      testAreaModel = {
        id: '1',
        title: 'title',
        imageContents: 'imageContents',
        stars: 1,
      };
      testArea = new PosterSessionAreaController(testAreaModel);
      expect(testArea.posterSessionAreaModel()).toEqual({
        id: testAreaModel.id,
        title: testAreaModel.title,
        imageContents: testAreaModel.imageContents,
        stars: testAreaModel.stars,
      });
    });
  });

  describe('updateFrom', () => {
    it('Does not update the id property', () => {
      const existingID = testArea.id;
      const newModel: PosterSessionArea = {
        id: nanoid(),
        title: nanoid(),
        imageContents: nanoid(),
        stars: testAreaModel.stars + 1,
      };
      testArea.updateFrom(newModel);
      expect(testArea.id).toEqual(existingID);
    });
  });
});
