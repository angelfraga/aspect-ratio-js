import { AspectRatio } from './aspect-ratio';

describe('AspectRatio', () => {
  describe('init', () => {

    it('when valid options are provided should init', () => {
      const container = document.createElement('div');
      const mask = document.createElement('div');

      const aspectRatio = new AspectRatio({
        container,
        mask,
        align: 'center center',
        ratio: '16/9'
      });

      expect(aspectRatio).toBeDefined();
    });

    it('when container is not provided should throw error', () => {
      const container = null;
      const mask = document.createElement('div');

      const check = () => {
        new AspectRatio({
          container,
          mask,
          align: 'center center',
          ratio: '16/9'
        });
      }

      expect(check).toThrow(Error);
    });

    it('when mask is not provided should throw error', () => {
      const container = document.createElement('div');
      const mask = null;

      const check = () => {
        new AspectRatio({
          container,
          mask,
          align: 'center center',
          ratio: '16/9'
        });
      }

      expect(check).toThrow(Error);
    });
  });

  describe('mask', () => {
    it('when giving a valid mask element should not throw error', () => {
      const container = document.createElement('div');
      const mask = document.createElement('div');
      const secondMask = document.createElement('div');

      const aspectRatio = new AspectRatio({
        container,
        mask,
        align: 'center center',
        ratio: '16/9'
      });

      const check = () => {
        aspectRatio.mask = secondMask;
      }

      expect(check).not.toThrow(Error);
    });

    it('when giving an invalid mask element should throw error', () => {
      const container = document.createElement('div');
      const mask = document.createElement('div');

      const aspectRatio = new AspectRatio({
        container,
        mask,
        align: 'center center',
        ratio: '16/9'
      });

      const check = () => {
        aspectRatio.mask = null;
      }

      expect(check).toThrow(Error);
    });
  })
});
