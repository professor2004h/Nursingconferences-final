#!/usr/bin/env python3
"""
SMTP Test Script for Hostinger
Tests the provided SMTP credentials directly
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_hostinger_smtp():
    # Email configuration
    smtp_server = 'smtp.hostinger.com'
    sender_email = 'accounts@intelliglobalconferences.com'
    password = 'Muni@12345m'
    receiver_email = 'professor2004h@gmail.com'
    
    print("🔍 Testing Hostinger SMTP Configuration...")
    print(f"Server: {smtp_server}")
    print(f"Sender: {sender_email}")
    print(f"Receiver: {receiver_email}")
    
    # Test different port configurations
    configurations = [
        {'port': 465, 'use_ssl': True, 'name': 'SSL Port 465'},
        {'port': 587, 'use_ssl': False, 'name': 'STARTTLS Port 587'},
        {'port': 25, 'use_ssl': False, 'name': 'Plain Port 25'}
    ]
    
    for config in configurations:
        print(f"\n📧 Testing {config['name']}...")
        
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            message["Subject"] = f"SMTP Test - {config['name']}"
            
            body = f"""
            SMTP Test Email
            
            Configuration: {config['name']}
            Server: {smtp_server}
            Port: {config['port']}
            SSL: {config['use_ssl']}
            Timestamp: {__import__('datetime').datetime.now()}
            
            If you receive this email, the SMTP configuration is working!
            """
            
            message.attach(MIMEText(body, "plain"))
            
            # Connect and send
            if config['use_ssl']:
                # SSL connection
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(smtp_server, config['port'], context=context) as server:
                    print(f"  ✓ Connected to {smtp_server}:{config['port']} (SSL)")
                    server.login(sender_email, password)
                    print(f"  ✓ Authenticated as {sender_email}")
                    server.sendmail(sender_email, receiver_email, message.as_string())
                    print(f"  ✅ Email sent successfully via {config['name']}")
                    return True
            else:
                # STARTTLS connection
                with smtplib.SMTP(smtp_server, config['port']) as server:
                    print(f"  ✓ Connected to {smtp_server}:{config['port']}")
                    server.starttls()
                    print(f"  ✓ STARTTLS enabled")
                    server.login(sender_email, password)
                    print(f"  ✓ Authenticated as {sender_email}")
                    server.sendmail(sender_email, receiver_email, message.as_string())
                    print(f"  ✅ Email sent successfully via {config['name']}")
                    return True
                    
        except smtplib.SMTPAuthenticationError as e:
            print(f"  ❌ Authentication failed: {e}")
        except smtplib.SMTPConnectError as e:
            print(f"  ❌ Connection failed: {e}")
        except smtplib.SMTPException as e:
            print(f"  ❌ SMTP error: {e}")
        except Exception as e:
            print(f"  ❌ Unexpected error: {e}")
    
    print("\n❌ All SMTP configurations failed")
    return False

def test_connection_only():
    """Test just the connection without authentication"""
    smtp_server = 'smtp.hostinger.com'
    
    print("\n🔍 Testing basic connection to Hostinger SMTP...")
    
    ports = [25, 587, 465]
    for port in ports:
        try:
            print(f"  Testing port {port}...")
            with smtplib.SMTP(smtp_server, port, timeout=10) as server:
                print(f"  ✓ Successfully connected to {smtp_server}:{port}")
                response = server.noop()
                print(f"  ✓ Server response: {response}")
        except Exception as e:
            print(f"  ❌ Port {port} failed: {e}")

if __name__ == "__main__":
    print("🧪 SMTP Test Script for Hostinger")
    print("=" * 50)
    
    # Test basic connection first
    test_connection_only()
    
    # Test full SMTP with authentication
    success = test_hostinger_smtp()
    
    if success:
        print("\n🎉 SMTP test completed successfully!")
    else:
        print("\n💡 Suggestions:")
        print("1. Verify the email account exists in Hostinger control panel")
        print("2. Check if SMTP is enabled for the account")
        print("3. Confirm the password is correct")
        print("4. Check if 2FA is enabled (may need app password)")
        print("5. Contact Hostinger support for SMTP configuration")
