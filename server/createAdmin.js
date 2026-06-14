import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        const email = 'admin@scmsc.com';
        const password = 'adminpassword123';
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('✅ Admin user already exists!');
            console.log('Email: admin@scmsc.com');
            console.log('Password: adminpassword123');
            process.exit(0);
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const adminUser = new User({
            fullName: 'System Admin',
            email,
            password: hashedPassword,
            role: 'Admin',
            address: 'City Hall'
        });
        
        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log('Email: admin@scmsc.com');
        console.log('Password: adminpassword123');
        console.log('-----------------------------------');
        console.log('You can now log in to the frontend using these credentials to access the Admin Dashboard.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
