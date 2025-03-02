const firstCotent = () => {
  return (
    <p>
      📢 [Dotted Beta Period & Verification Notice]
      <br /> 📅 Beta Period: March 1st – March 22st
      <br /> Dotted is a private community exclusively for verified Sogang
      students. To fully access the Community and Market, you need to verify
      that you are a Sogang University student.
      <br /> 🔓 [Beta Period: Free Access] Until March 22nd, you can freely
      access the Community and Market without verification. <br />
      🔒 [After March 22nd: Verification Required] Starting March 23rd, only
      verified Sogang students will have full access to the Community and
      Market. <br />
      📝 How to Verify?
      <br />
      1.Sign up with your Sogang email to complete registration and student
      verification simultaneously!
      <br />
      2.If you don’t register with a Sogang email, upload a photo of your
      student ID or SAINT portal screenshot (only name & school name visible) in
      mypage → school verification
    </p>
  );
};
const secondCotent = () => {
  return (
    <p>
      How to create a Sogang Email? <br />
      1.Login to Saint and click 'Web mails
      <br />
      <img src="https://i.imgur.com/LkkLrmi.png" alt="webmail" />
      2.Complete the registration application Your email request will be
      reviewed and approved by the IT support Center at Sogang(takes about 1-2
      days) <br />
      3. Once approved, use your Sogang Email(@sogang.ac.kr)to sign up for
      Dotted and complete student verification!
    </p>
  );
};
export const NoticeList = [
  {
    id: 1,
    title: '📢 [Dotted Beta Period & Verification Notice]',
    created_at: '2025-03-01',
    content: firstCotent
  },
  {
    id: 2,
    title: 'How to create a Sogang Email?',
    created_at: '2025-03-01',
    content: secondCotent
  }
];
