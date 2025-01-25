import React, { useState } from 'react';
import { Card, Button, Input } from 'antd';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  const handleProfileUpdate = () => {
    // Update profile logic here
    alert('Profile updated');
  };

  return (
    <div style={{ padding: '50px' }}>
      <Card title="Your Profile">
        <Input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Enter your name"
        />
        <Input
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Enter your email"
          style={{ marginTop: '10px' }}
        />
        <Button onClick={handleProfileUpdate} type="primary" style={{ marginTop: '20px' }}>
          Update Profile
        </Button>
      </Card>
    </div>
  );
};

export default ProfilePage;
