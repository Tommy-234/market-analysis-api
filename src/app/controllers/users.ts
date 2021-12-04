import { Router } from 'express';
import { first, isEmpty } from 'lodash';
import { body, validationResult } from 'express-validator';
import { User, UserService } from '../../lib/database';

class UserController {
  userService: UserService;
  router: Router;

  constructor() {
    this.userService = new UserService();
    this.routes();
  }

  private routes() {
    const router = Router();
    router.get(
      '/:id',
      async (req, res) => {
        console.log('users controller, /:id GET, id = ', req.params.id);
        const user = await this.userService.findOne(req.params.id);
        if (user) {
          return res.status(200).json(user);
        }
        return res.status(400).json({ message: "Invalid User" });
      }
    );
    router.put(
      '/:id',
      body('username').isString(),
      body('password').isString(),
      body('email').isEmail(),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        const user = await this.userService.findOne(req.params.id);
        if (user) {
          const updatedUser = await this.userService.update(req.params.id, req.body as User);
          return res.status(200).json(updatedUser);
        }
        return res.status(404).json({ message: "Invalid User" });
      }
    );   
    router.post(
      '/',
      body('username').isString(),
      body('password').isString(),
      body('email').isEmail(),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        return this.userService.create(req.body as User)
          .then( newUser => res.status(201).json({ id: newUser._id }))
          .catch( error => res.status(400).json({ error: "Duplicate User" }));
      }
    );
    router.post(
      '/login',
      body('username').isString(),
      body('password').isString(),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const user = first(await this.userService.find({ username: req.body.username }));
        if (isEmpty(user) || user.password !== req.body.password) {
          return res.status(400).json({ error: "Invalid User" });
        }

        return res.status(200).json({ id: user._id });
      }
    );
    this.router = router;
  }
}

export default new UserController().router;
