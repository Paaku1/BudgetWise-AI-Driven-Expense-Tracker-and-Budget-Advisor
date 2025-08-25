import React from "react";
import "./Homepage.css";
import heroImage from "../assets/hero-dashboard.jpeg";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
     <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <span>B</span>
            </div>
            <span className="brand-text">BudgetWise - <i>AI Driven Expense Tracker and Budget Advisor</i></span>
          </div>
          {/* <div className="nav-links">
            <Link to="/features" className="nav-link">Features</Link>
            <Link to="/pricing" className="nav-link">Pricing</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div> */}
          <div className="nav-actions">
            <Link to="/login" className="btn-outline">Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Master Your Money with <span className="gradient-text">AI-Powered</span> Insights
              </h1>
              <p className="hero-description">
                Take control of your financial future with BudgetWise's intelligent expense tracking, 
                personalized budgeting advice, and community-driven financial tips. Let AI guide you 
                towards better money management decisions.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-hero-primary">Start Now</Link>
                {/* <Link to="/demo" className="btn-hero-outline">Watch Demo</Link> */}
              </div>
              {/* <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon shield">🛡️</div>
                  <span>Bank-level security</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon zap">⚡</div>
                  <span>AI-powered insights</span>
                </div>
              </div> */}
            </div>
            <div className="hero-image">
              <div className="image-container">
                <img src={heroImage} alt="BudgetWise Dashboard" />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">Why Choose BudgetWise?</h2>
            <p className="features-description">
              Experience the future of personal finance management with AI-driven insights, 
              smart automation, and community support.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon primary">🧠</div>
                <h3 className="card-title">AI-Powered Analytics</h3>
                <p className="card-description">
                  Get personalized financial insights and recommendations powered by advanced machine learning algorithms.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon success">📈</div>
                <h3 className="card-title">Smart Expense Tracking</h3>
                <p className="card-description">
                  Automatically categorize transactions and identify spending patterns to help you make better financial decisions.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon accent">🎯</div>
                <h3 className="card-title">Goal Setting & Tracking</h3>
                <p className="card-description">
                  Set financial goals and track your progress with intelligent milestones and achievement notifications.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon info">📊</div>
                <h3 className="card-title">Advanced Reporting</h3>
                <p className="card-description">
                  Generate comprehensive financial reports with beautiful visualizations and actionable insights.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon warning">👥</div>
                <h3 className="card-title">Community Tips</h3>
                <p className="card-description">
                  Connect with a community of financially savvy users and share budgeting tips and strategies.
                </p>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-header">
                <div className="card-icon success">💰</div>
                <h3 className="card-title">Budget Optimization</h3>
                <p className="card-description">
                  Receive AI-generated budget recommendations tailored to your spending habits and financial goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Transform Your Financial Future?</h2>
          <p className="cta-description">
            Join thousands of users who have already taken control of their finances with BudgetWise. 
            Start your free trial today and experience the power of AI-driven financial management.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">Get Started Free</Link>
            <Link to="/contact" className="btn-cta-outline">Contact Sales</Link>
          </div>
          <p className="cta-note">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-icon">
                  <span>B</span>
                </div>
                <span className="footer-brand-text">BudgetWise</span>
              </div>
              <p className="footer-description">
                Empowering financial freedom through AI-driven insights and smart budgeting tools.
              </p>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Product</h3>
              <ul className="footer-links">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/security">Security</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/terms">Terms</Link></li>
              </ul>
            </div>
          </div> */}
          <div className="footer-bottom">
            <p>&copy; 2025 BudgetWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
