import userDTO from '../DAO/DTO/user.dto.js';
import { logger } from '../utils/logger.js';
import ServiceUsers from '../services/users.service.js';
import dotenv from 'dotenv';
import UserModel from '../DAO/models/users.model.js';
dotenv.config();
const serviceUsers = new ServiceUsers();

class UserController {
  async userDataBase(req, res) {
    try {
      const userBaseData = await serviceUsers.getAllUsersService();
      const totalUsers = userBaseData.map((user) => {
        return {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          age: user.age,
          cartID: user.cartID,
        };
      });
      logger.info(`User data base loaded`, totalUsers);
      logger.debug('Rendering admin page');
      res.status(200).render('admin', { users: totalUsers });
    } catch (err) {
      logger.error('Error getting cart by ID:', err);
      res.status(404).json({ status: 'error', message: 'Error loading data base' });
    }
  }

  async renderChangeUserRole(req, res) {
    try {
      const { uid } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.render('changeUserRole', { user });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error: Can not change user role' });
    }
  }

  async changeUserRole(req, res) {
    try {
      const { uid } = req.params;
      const newRole = req.body.role;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.role = newRole;
      await user.save();
      return res.redirect('/api/sessions/admincontrol');
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error: Can not change user role' });
    }
  }
  async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const user = await serviceUsers.getUserByIdService(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const uploadedFiles = req.files;
      const documents = [];
      for (const file of uploadedFiles) {
        const document = {
          name: file.originalname,
          reference: file.filename,
          status: 'pending',
        };
        documents.push(document);
      }
      user.documents = documents;
      await user.save();
      res.status(200).redirect('/api/sessions/current');
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error: Unable to upload documents' });
    }
  }
  async uploadProfileImage(req, res) {
    try {
      const { uid } = req.params;
      const profileImage = req.file;
      console.log(profileImage);
      await UserModel.findOneAndUpdate({ _id: uid }, { profileImage: profileImage.filename });
      res.locals.profileImage = profileImage.filename;
      res.status(200).redirect('/api/sessions/current');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar la imagen de perfil' });
    }
  }
}
export default UserController;
