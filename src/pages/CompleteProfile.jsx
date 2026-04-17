import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { completeProfile, loadUserProfile } from '../redux/slices/profileSlice';
import { loadCurrentUser } from '../redux/slices/authSlice';
import './CompleteProfile.css';

const steps = ['Personal details', 'Employment details', 'Experience', 'Leave policy', 'Review & submit'];

const initialValues = {
  userName: '',
  aadharNumber: '',
  panNumber: '',
  bloodGroup: '',
  city: '',
  state: '',
  pincode: '',
  emergencyContact: '',
  joiningDate: '',
  department: '',
  experienceType: 'fresher',
  previousCompany: '',
  experienceYears: '',
  experienceMonths: '',
  salarySlips: [],
  offerLetters: [],
  relievingLetters: [],
};

const validationSchemas = [
  Yup.object({
    userName: Yup.string().required('Full name is required'),
    aadharNumber: Yup.string().required('Aadhar number is required'),
    panNumber: Yup.string().required('PAN number is required'),
    bloodGroup: Yup.string().required('Blood group is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().required('Pincode is required'),
    emergencyContact: Yup.string().required('Emergency contact is required'),
  }),
  Yup.object({
    joiningDate: Yup.date().required('Joining date is required'),
    department: Yup.string().required('Department is required'),
  }),
  Yup.object().shape({
    experienceType: Yup.string().oneOf(['fresher', 'experienced']).required('Experience type is required'),
    previousCompany: Yup.string().when('experienceType', (experienceType, schema) => (
      experienceType === 'experienced'
        ? schema.required('Previous company is required')
        : schema.notRequired()
    )),
    experienceYears: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .when('experienceType', (experienceType, schema) => (
        experienceType === 'experienced'
          ? schema.min(0).required('Experience years is required')
          : schema.notRequired()
      )),
    experienceMonths: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .nullable()
      .when('experienceType', (experienceType, schema) => (
        experienceType === 'experienced'
          ? schema.min(0).max(11).required('Experience months is required')
          : schema.notRequired()
      )),
  }),
];

const CompleteProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.profile);
  const [step, setStep] = useState(1);
  const [employeeId] = useState(`EMP${Date.now()}`);

  useEffect(() => {
    if (currentUser?.profileCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (success) {
      dispatch(loadCurrentUser());
      dispatch(loadUserProfile());
      navigate('/dashboard', { replace: true });
    }
  }, [success, dispatch, navigate]);

  const currentSchema = useMemo(() => validationSchemas[step - 1] || validationSchemas[0], [step]);

  const getTotalExperience = (values) => {
    const years = Number(values.experienceYears || 0);
    const months = Number(values.experienceMonths || 0);
    return `${years} year(s) ${months} month(s)`;
  };

  return (
    <div className="complete-profile-page">
      <div className="profile-shell">
        <header className="profile-header">
          <p className="eyebrow">Employee onboarding</p>
          <h1>Complete your profile</h1>
          <p>Finish the multi-step onboarding process to activate your employee account.</p>
        </header>

        <div className="stepper-bar">
          {steps.map((label, index) => (
            <div key={label} className={`step-item ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'completed' : ''}`}>
              <span>{index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>

        <Formik
          initialValues={{ ...initialValues, userName: currentUser?.userName || '' }}
          validationSchema={currentSchema}
          onSubmit={async (values, actions) => {
            if (step < 5) {
              setStep(step + 1);
              actions.setTouched({});
              return;
            }

            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
              if (['salarySlips', 'offerLetters', 'relievingLetters'].includes(key)) return;
              if (value !== undefined && value !== null) {
                formData.append(key, value);
              }
            });
            formData.append('employeeId', employeeId);
            formData.append('role', currentUser?.role || 'mr');
            if (values.salarySlips.length) {
              Array.from(values.salarySlips).forEach((file) => formData.append('salarySlips', file));
            }
            if (values.offerLetters.length) {
              Array.from(values.offerLetters).forEach((file) => formData.append('offerLetters', file));
            }
            if (values.relievingLetters.length) {
              Array.from(values.relievingLetters).forEach((file) => formData.append('relievingLetters', file));
            }

            dispatch(completeProfile(formData));
          }}
        >
          {({ values, setFieldValue, handleSubmit }) => (
            <Form className="profile-form" onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              {step === 1 && (
                <div className="form-step">
                  <label>
                    Full name
                    <Field name="userName" placeholder="Full name" />
                    <ErrorMessage name="userName" component="div" className="input-error" />
                  </label>
                  <label>
                    Aadhar number
                    <Field name="aadharNumber" placeholder="Aadhar number" />
                    <ErrorMessage name="aadharNumber" component="div" className="input-error" />
                  </label>
                  <label>
                    PAN number
                    <Field name="panNumber" placeholder="PAN number" />
                    <ErrorMessage name="panNumber" component="div" className="input-error" />
                  </label>
                  <label>
                    Blood group
                    <Field as="select" name="bloodGroup">
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </Field>
                    <ErrorMessage name="bloodGroup" component="div" className="input-error" />
                  </label>
                  <div className="form-row">
                    <label>
                      City
                      <Field name="city" placeholder="City" />
                      <ErrorMessage name="city" component="div" className="input-error" />
                    </label>
                    <label>
                      State
                      <Field name="state" placeholder="State" />
                      <ErrorMessage name="state" component="div" className="input-error" />
                    </label>
                    <label>
                      Pincode
                      <Field name="pincode" placeholder="Pincode" />
                      <ErrorMessage name="pincode" component="div" className="input-error" />
                    </label>
                  </div>
                  <label>
                    Emergency contact number
                    <Field name="emergencyContact" placeholder="Emergency contact" />
                    <ErrorMessage name="emergencyContact" component="div" className="input-error" />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="form-step">
                  <div className="form-callout">
                    <h3>Employee ID</h3>
                    <p>{employeeId}</p>
                  </div>
                  <div className="form-row">
                    <label>
                      Role
                      <Field as="select" name="role" disabled>
                        <option value={currentUser?.role || 'mr'}>{currentUser?.role || 'MR'}</option>
                      </Field>
                    </label>
                    <label>
                      Joining date
                      <Field type="date" name="joiningDate" />
                      <ErrorMessage name="joiningDate" component="div" className="input-error" />
                    </label>
                  </div>
                  <label>
                    Department
                    <Field name="department" placeholder="Department" />
                    <ErrorMessage name="department" component="div" className="input-error" />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="form-step">
                  <div className="form-row">
                    <label>
                      <span>Experience status</span>
                      <div className="radio-group">
                        <label>
                          <Field type="radio" name="experienceType" value="fresher" onClick={() => setFieldValue('experienceType', 'fresher')} />
                          Fresher
                        </label>
                        <label>
                          <Field type="radio" name="experienceType" value="experienced" onClick={() => setFieldValue('experienceType', 'experienced')} />
                          Experienced
                        </label>
                      </div>
                    </label>
                  </div>

                  {values.experienceType === 'experienced' ? (
                    <>
                      <label>
                        Previous company name
                        <Field name="previousCompany" placeholder="Previous company" />
                        <ErrorMessage name="previousCompany" component="div" className="input-error" />
                      </label>
                      <div className="form-row">
                        <label>
                          Years of experience
                          <Field type="number" name="experienceYears" min="0" />
                          <ErrorMessage name="experienceYears" component="div" className="input-error" />
                        </label>
                        <label>
                          Months
                          <Field type="number" name="experienceMonths" min="0" max="11" />
                          <ErrorMessage name="experienceMonths" component="div" className="input-error" />
                        </label>
                      </div>
                      <div className="upload-row">
                        <label>
                          Salary slips
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => setFieldValue('salarySlips', event.currentTarget.files)}
                          />
                        </label>
                        <label>
                          Offer letter
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => setFieldValue('offerLetters', event.currentTarget.files)}
                          />
                        </label>
                        <label>
                          Relieving letter
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(event) => setFieldValue('relievingLetters', event.currentTarget.files)}
                          />
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="info-card">
                      <p>As a fresher, you can skip the experience document upload section.</p>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="form-step">
                  <div className="leave-policy-grid">
                    <article>
                      <h3>Sick leave</h3>
                      <p>12 days / year</p>
                    </article>
                    <article>
                      <h3>Casual leave</h3>
                      <p>10 days / year</p>
                    </article>
                    <article>
                      <h3>Maternity leave</h3>
                      <p>180 days if applicable</p>
                    </article>
                  </div>
                  <p className="policy-note">Leave balance is auto-filled after onboarding and stored in your employee profile.</p>
                </div>
              )}

              {step === 5 && (
                <div className="form-step review-step">
                  <h2>Review your onboarding details</h2>
                  <div className="review-grid">
                    <div>
                      <h4>Personal</h4>
                      <p>{values.userName}</p>
                      <p>{values.aadharNumber}</p>
                      <p>{values.panNumber}</p>
                      <p>{values.bloodGroup}</p>
                      <p>{values.city}, {values.state}, {values.pincode}</p>
                      <p>Emergency: {values.emergencyContact}</p>
                    </div>
                    <div>
                      <h4>Employment</h4>
                      <p>Employee ID: {employeeId}</p>
                      <p>Role: {currentUser?.role}</p>
                      <p>Joining date: {values.joiningDate}</p>
                      <p>Department: {values.department}</p>
                    </div>
                    <div>
                      <h4>Experience</h4>
                      <p>{values.experienceType === 'experienced' ? 'Experienced' : 'Fresher'}</p>
                      {values.experienceType === 'experienced' && (
                        <>
                          <p>Company: {values.previousCompany}</p>
                          <p>Experience: {getTotalExperience(values)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                {step > 1 && (
                  <button type="button" className="button outline" onClick={() => setStep(step - 1)}>
                    Back
                  </button>
                )}
                <button type="submit" className="button primary" disabled={loading}>
                  {step < 5 ? 'Next step' : 'Submit profile'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompleteProfile;
