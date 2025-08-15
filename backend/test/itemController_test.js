const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { expect } = chai;

const Item = require('../models/Item');
const {
  addItem,
  getApprovedItems,
  getMyItems,
  updateItem,
  getPendingItems,
  approveItem,
  rejectItem
} = require('../controllers/itemController');

describe('Item Controller Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ---------------- addItem ----------------
  describe('addItem', () => {
    it('should create a new item successfully with deadline', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const req = {
        user: { id: fakeUserId },
        body: { 
          title: 'Lost wallet', 
          description: 'Black wallet', 
          type: 'lost', 
          campus: 'Gardens Point',
          location: 'Library',
          deadline: '2025-08-20'
        },
        file: null
      };
      const createdItem = {
        _id: new mongoose.Types.ObjectId(),
        userId: fakeUserId,
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        campus: req.body.campus,
        location: req.body.location,
        deadline: req.body.deadline
      };
      sinon.stub(Item, 'create').resolves(createdItem);
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addItem(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdItem)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'create').rejects(new Error('DB Error'));

      const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      try {
        await addItem(req, res);
      } catch (err) {
        // 捕捉 controller 內部 async error
      }

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------- getApprovedItems ----------------
  describe('getApprovedItems', () => {
    it('should return approved items', async () => {
      const fakeItems = [{ _id: '1', status: 'approved' }];
      sinon.stub(Item, 'find').resolves(fakeItems);
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getApprovedItems(req, res);

      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'find').rejects(new Error('DB Error'));
      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      try {
        await getApprovedItems(req, res);
      } catch (err) {}

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------- getMyItems ----------------
  describe('getMyItems', () => {
    it('should return items of the user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeItems = [{ _id: '1', userId: fakeUserId }];
      sinon.stub(Item, 'find').resolves(fakeItems);
      const req = { user: { id: fakeUserId } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await getMyItems(req, res);

      expect(res.json.calledWith(fakeItems)).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'find').rejects(new Error('DB Error'));
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      try {
        await getMyItems(req, res);
      } catch (err) {}

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------- updateItem ----------------
  describe('updateItem', () => {
    it('should update item with new values including deadline', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();
      const fakeItem = {
        _id: new mongoose.Types.ObjectId(),
        userId: fakeUserId,
        title: 'Old title',
        description: 'Old desc',
        type: 'lost',
        campus: 'Gardens Point',
        location: 'Library',
        deadline: '2025-08-01',
        save: sinon.stub().resolvesThis()
      };
      sinon.stub(Item, 'findById').resolves(fakeItem);

      const req = {
        params: { id: fakeItem._id.toString() },
        user: { id: fakeUserId, role: 'user' },
        body: { 
          title: 'New title',
          description: 'New desc',
          type: 'found',
          campus: 'Kelvin Grove',
          location: 'Cafe',
          deadline: '2025-08-25'
        },
        file: null
      };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await updateItem(req, res);

      expect(fakeItem.title).to.equal('New title');
      expect(fakeItem.description).to.equal('New desc');
      expect(fakeItem.type).to.equal('found');
      expect(fakeItem.campus).to.equal('Kelvin Grove');
      expect(fakeItem.location).to.equal('Cafe');
      expect(fakeItem.deadline).to.equal('2025-08-25');
      expect(res.json.calledWith(fakeItem)).to.be.true;
    });

    it('should return 403 if user not authorized', async () => {
      const fakeItem = { userId: 'otherUserId', save: sinon.stub() };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: 'id' }, user: { id: 'notOwner', role: 'user' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateItem(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Not authorized to update this item' })).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      sinon.stub(Item, 'findById').resolves(null);
      const req = { params: { id: 'id' }, user: { id: 'user' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateItem(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      sinon.stub(Item, 'findById').rejects(new Error('DB Error'));
      const req = { params: { id: 'id' }, user: { id: 'user' }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      try {
        await updateItem(req, res);
      } catch (err) {}

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------- approveItem ----------------
  describe('approveItem', () => {
    it('should approve item for admin', async () => {
      const fakeItem = { status: 'pending', save: sinon.stub().resolves() };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: 'id' }, user: { role: 'admin' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await approveItem(req, res);

      expect(fakeItem.status).to.equal('approved');
      expect(res.json.calledWith({ message: 'Item approved' })).to.be.true;
    });

    it('should return 403 if not admin', async () => {
      const req = { params: { id: 'id' }, user: { role: 'user' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await approveItem(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Admin access required' })).to.be.true;
    });
  });

  // ---------------- rejectItem ----------------
  describe('rejectItem', () => {
    it('should reject item for admin', async () => {
      const fakeItem = { status: 'pending', save: sinon.stub().resolves() };
      sinon.stub(Item, 'findById').resolves(fakeItem);
      const req = { params: { id: 'id' }, user: { role: 'admin' } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await rejectItem(req, res);

      expect(fakeItem.status).to.equal('rejected');
      expect(res.json.calledWith({ message: 'Item rejected' })).to.be.true;
    });

    it('should return 403 if not admin', async () => {
      const req = { params: { id: 'id' }, user: { role: 'user' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await rejectItem(req, res);

      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.calledWith({ message: 'Admin access required' })).to.be.true;
    });
  });
});