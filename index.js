const { MongoClient, ObjectId } = require('mongodb');

// Configuration
const url = 'mongodb://127.0.0.1:27017'; // or 'mongodb://localhost:27017'
const client = new MongoClient(url);
const dbName = 'student_course';
const collectionName = 'enrollments';

async function createEnrollment(collection, enrollmentData) {
    try {
        const result = await collection.insertOne(enrollmentData);
        console.log(`[CREATE] Inserted enrollment with _id: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error('[CREATE] Error inserting enrollment:', error);
        throw error;
    }
}


async function createManyEnrollments(collection, enrollmentList) {
    try {
        const result = await collection.insertMany(enrollmentList);
        console.log(`[CREATE] Inserted ${result.insertedCount} enrollments.`);
        return result;
    } catch (error) {
        console.error('[CREATE] Error inserting multiple enrollments:', error);
        throw error;
    }
}


async function getAllEnrollments(collection) {
    try {
        const enrollments = await collection.find({}).toArray();
        console.log(`[READ] Found ${enrollments.length} total enrollments.`);
        return enrollments;
    } catch (error) {
        console.error('[READ] Error fetching enrollments:', error);
        throw error;
    }
}


async function getEnrollmentByCode(collection, enrollmentCode) {
    try {
        const enrollment = await collection.findOne({ enrollmentCode });
        if (enrollment) {
            console.log(`[READ] Found enrollment code ${enrollmentCode}:`, enrollment);
        } else {
            console.log(`[READ] No enrollment found with code: ${enrollmentCode}`);
        }
        return enrollment;
    } catch (error) {
        console.error(`[READ] Error fetching enrollment ${enrollmentCode}:`, error);
        throw error;
    }
}


async function getEnrollmentsByStudent(collection, studentCode) {
    try {
        const list = await collection.find({ studentCode }).toArray();
        console.log(`[READ] Found ${list.length} enrollment(s) for student ${studentCode}.`);
        return list;
    } catch (error) {
        console.error(`[READ] Error fetching enrollments for student ${studentCode}:`, error);
        throw error;
    }
}


async function updateEnrollment(collection, enrollmentCode, updateFields) {
    try {
        const result = await collection.updateOne(
            { enrollmentCode },
            { $set: updateFields }
        );
        console.log(`[UPDATE] Modified ${result.modifiedCount} document(s) for enrollmentCode: ${enrollmentCode}`);
        return result;
    } catch (error) {
        console.error(`[UPDATE] Error updating enrollment ${enrollmentCode}:`, error);
        throw error;
    }
}


async function deleteEnrollment(collection, enrollmentCode) {
    try {
        const result = await collection.deleteOne({ enrollmentCode });
        console.log(`[DELETE] Deleted ${result.deletedCount} document(s) for enrollmentCode: ${enrollmentCode}`);
        return result;
    } catch (error) {
        console.error(`[DELETE] Error deleting enrollment ${enrollmentCode}:`, error);
        throw error;
    }
}


async function main() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected successfully to MongoDB server.');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        console.log('\n--- 1. READ ALL INITIAL ENROLLMENTS ---');
        const initialEnrollments = await getAllEnrollments(collection);
        console.log(initialEnrollments);

        console.log('\n--- 2. CREATE A NEW ENROLLMENT ---');
        const newEnrollment = {
            enrollmentCode: 'EN999',
            studentCode: 'SV001',
            courseCode: 'IT204',
            semester: '2025-2026-2',
            score: 9.0,
            grade: 'A+'
        };
        await createEnrollment(collection, newEnrollment);

        console.log('\n--- 3. READ SPECIFIC ENROLLMENT ---');
        await getEnrollmentByCode(collection, 'EN999');

        console.log('\n--- 4. UPDATE ENROLLMENT ---');
        await updateEnrollment(collection, 'EN999', {
            score: 9.5,
            grade: 'A+'
        });
        await getEnrollmentByCode(collection, 'EN999');

        console.log('\n--- 5. DELETE ENROLLMENT ---');
        await deleteEnrollment(collection, 'EN999');

        console.log('\n--- 6. VERIFY DELETION ---');
        await getEnrollmentByCode(collection, 'EN999');

    } catch (error) {
        console.error('Error during execution:', error);
    } finally {
        await client.close();
        console.log('\nMongoDB connection closed.');
    }
}


if (require.main === module) {
    main();
}

module.exports = {
    createEnrollment,
    createManyEnrollments,
    getAllEnrollments,
    getEnrollmentByCode,
    getEnrollmentsByStudent,
    updateEnrollment,
    deleteEnrollment
};
