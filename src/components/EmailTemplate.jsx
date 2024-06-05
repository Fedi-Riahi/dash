// EmailTemplate.js

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const EmailTemplate = ({ status }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link href="#">
          <Image src="https://merakiui.com/images/full-logo.svg" alt="Meraki UI Logo" width={120} height={30} />
        </Link>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="#" style={{ color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>Login</Link>
          <Link href="#" style={{ color: '#6366F1', textDecoration: 'none', fontSize: '14px' }}>Register</Link>
        </div>
      </header>

      <main>
        <Image src="https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt="" width={600} height={400} />
        
        <h2 style={{ fontSize: '24px', color: '#2563EB', marginBottom: '16px' }}>Appointment Status Update</h2>

        <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
          Your appointment status has been updated to <strong>{status}</strong>.
        </p>
        
        <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
          Thanks, <br />
          Meraki UI team
        </p>
      </main>

      <footer style={{ marginTop: '40px', fontSize: '14px', color: '#4B5563' }}>
        <p>
          This email was sent to <Link href="#" style={{ color: '#6366F1', textDecoration: 'underline' }}>contact@merakiui.com</Link>. 
          If you'd rather not receive this kind of email, you can <Link href="#" style={{ color: '#6366F1', textDecoration: 'underline' }}>unsubscribe</Link> or <Link href="#" style={{ color: '#6366F1', textDecoration: 'underline' }}>manage your email preferences</Link>.
        </p>

        <p>© Meraki UI. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default EmailTemplate;
