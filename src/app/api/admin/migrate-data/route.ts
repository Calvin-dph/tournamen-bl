import { NextResponse } from 'next/server';
import { migrateDataFromSheetsToDatabase } from '@/lib/migrate-data';

export async function POST() {
  try {
    const result = await migrateDataFromSheetsToDatabase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Migration completed successfully',
        data: result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Migration failed',
        error: 'error' in result ? result.error : 'Unknown error occurred'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration API failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}