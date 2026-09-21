import React from 'react';
import { LegalModal } from './LegalModal';

interface PrivacyAdSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'dmca' | 'contact';
}

export const PrivacyAdSenseModal: React.FC<PrivacyAdSenseModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  return <LegalModal isOpen={isOpen} onClose={onClose} initialTab={initialTab} />;
};

export default PrivacyAdSenseModal;
