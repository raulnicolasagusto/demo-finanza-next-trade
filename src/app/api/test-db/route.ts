import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/api/db/connection';
import { User, Expense } from '@/api/models';

// Test endpoint to verify MongoDB connection and models
export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Test database connection
    const userCount = await User.countDocuments();
    const expenseCount = await Expense.countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      data: {
        userCount,
        expenseCount,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Example POST endpoint to create a test user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { user_id, email, first_name, last_name, image_perfil } = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ user_id });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User already exists'
        },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = new User({
      user_id,
      email,
      first_name,
      last_name,
      image_perfil
    });
    
    await newUser.save();
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}