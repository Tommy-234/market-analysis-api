import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { User, UserService } from '../../lib/database'

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
      body('userName').isString(),
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
      body('userName').isString(),
      body('password').isString(),
      body('email').isEmail(),
      async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const newUser = await this.userService.create(req.body as User);
        return res.status(201).json(newUser);
      }
    );
    this.router = router;
  }
}

export default new UserController().router;
